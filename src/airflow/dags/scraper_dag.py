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

# Task 1: Clean up previous files
cleanup_task = BashOperator(
    task_id='cleanup_previous_files',
    bash_command='rm -f "/opt/airflow/data/scraped_data*.json"',
    dag=dag,
)

# Task 2: Run web scraper
scraper_task = DockerOperator(
    task_id='run_scraper',
    image='scraper',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    network_mode='src_tfm_network',
    mounts=[Mount(source='C:/Users/marti/Desktop/TFM/src/.volumes/scraper', target='/app/data', type='bind')],
    environment={
        'OUTPUT_FILE': '/app/data/scraped_data_{{ ds }}.json',
    },
    dag=dag,
)

# Task 3: Wait for scraper output file
file_sensor = FileSensor(
    task_id='wait_for_scraped_file',
    filepath='/opt/airflow/data/scraped_data_{{ ds }}.json',
    fs_conn_id='fs_default',
    poke_interval=5,
    timeout=300,
    dag=dag,
)

# Task 4: Validate scraped file
validate_file = BashOperator(
    task_id='validate_scraped_file',
    bash_command='''
    FILE="/opt/airflow/data/scraped_data_{{ ds }}.json"
    if [ -s "$FILE" ] && python3 -m json.tool "$FILE" > /dev/null 2>&1; then
        echo "File is valid JSON and not empty"
        exit 0
    else
        echo "File is invalid or empty"
        exit 1
    fi
    ''',
    dag=dag,
)

# Task 5: Run ETL process
etl_task = DockerOperator(
    task_id='run_etl',
    image='etl',
    api_version='auto',
    auto_remove=True,
    docker_url='unix://var/run/docker.sock',
    network_mode='src_tfm_network',
    mounts=[Mount(source='C:/Users/marti/Desktop/TFM/src/.volumes/scraper', target='/app/data', type='bind')],
    environment={
        'INPUT_FILE': '/app/data/scraped_data_{{ ds }}.json',
        'PROCESSED_DATE': '{{ ds }}',
    },
    dag=dag,
)

# Task 6: Cleanup successful run
cleanup_success = BashOperator(
    task_id='cleanup_on_success',
    bash_command='''
    # Keep only last 7 days of files
    find /opt/airflow/data -name "scraped_data_*.json" -mtime +7 -delete
    echo "Cleanup completed"
    ''',
    dag=dag,
)

# Define task dependencies
cleanup_task >> scraper_task >> file_sensor >> validate_file >> etl_task >> cleanup_success