from datetime import datetime, timedelta
from airflow import DAG
from airflow.providers.docker.operators.docker import DockerOperator
from docker.types import Mount
from airflow.operators.bash import BashOperator
from airflow.sensors.filesystem import FileSensor

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# Create the DAG
dag = DAG(
    'scraper_etl_pipeline',
    default_args=default_args,
    description='Daily web scraping and ETL pipeline',
    schedule_interval='0 2 * * *',  # Daily at 2 AM
    catchup=False,
    max_active_runs=1,
)

# Task 1: Run web scraper
scraper_task = DockerOperator(
    task_id='run_scraper',
    image='scraper',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    network_mode='src_tfm_network',
    mounts=[Mount(source='C:/Users/marti/Desktop/TFM/src/.volumes/scraper', target='/app/data', type='bind')],
    environment={
		'OUTPUT_DIR': '/app/data',
        'OUTPUT_FILE_SUFFIX': '_scraped_data_{{ ds }}.json',
    },
    dag=dag,
)

# Task 2: Wait for scraper output file
file_sensor = FileSensor(
    task_id='wait_for_scraped_file',
    filepath='/opt/airflow/data/*_scraped_data_{{ ds }}.json',
    fs_conn_id='fs_default',
    poke_interval=5,
    timeout=300,
    dag=dag,
)

# Task 3: Validate scraped file
validate_file = BashOperator(
    task_id='validate_scraped_file',
    bash_command='''
	for f in /opt/airflow/data/*_scraped_data_{{ ds }}.json; do
        if [ -f "$f" ] && python3 -m json.tool "$f" > /dev/null 2>&1; then
            echo "$f is valid JSON and not empty"
        else
            echo "$f is invalid or empty"
            exit 1
        fi
	done
	exit 0
    ''',
    dag=dag,
)

# Task 4: Run ETL process
etl_task = DockerOperator(
    task_id='run_etl',
    image='etl',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    network_mode='src_tfm_network',
    mounts=[Mount(source='C:/Users/marti/Desktop/TFM/src/.volumes/scraper', target='/app/data', type='bind')],
    environment={
        'INPUT_DIR': '/app/data',
        'INPUT_FILE_SUFFIX': '_scraped_data_{{ ds }}.json'
    },
    dag=dag,
)

# Task 5: Cleanup successful run
cleanup_success = BashOperator(
    task_id='cleanup_on_success',
    bash_command='''
    # Keep only last 7 days of files
    find /opt/airflow/data/ -name "*_scraped_data_*.json" -mtime +7 -delete
    echo "Cleanup completed"
    ''',
    dag=dag,
)

# Define task dependencies
scraper_task >> file_sensor >> validate_file >> etl_task >> cleanup_success