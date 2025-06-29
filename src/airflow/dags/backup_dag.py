from airflow import DAG
from airflow.providers.docker.operators.docker import DockerOperator
from docker.types import Mount
from airflow.utils.dates import days_ago
from datetime import timedelta

default_args = {
    'owner': 'airflow',
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    dag_id='mongo_backup_dag',
    default_args=default_args,
    description='MongoDB backup via DockerOperator with authentication',
    schedule_interval='0 0 1 * *',  # Monthly
    start_date=days_ago(1),
    catchup=False,
    tags=['mongodb', 'backup'],
) as dag:

    backup_task = DockerOperator(
        task_id='run_mongo_backup',
        image='mongo:8.0.6',
        container_name='airflow_mongo_backup_temp',
        api_version='auto',
        auto_remove=True,
        command=(
            '/bin/bash -c "'
            'mongodump --host database '
            '--username $MONGO_INITDB_ROOT_USERNAME '
            '--password $MONGO_INITDB_ROOT_PASSWORD '
            '--authenticationDatabase admin '
            '--out /backup/dump && '
            'tar -czf /backup/$(date +%F).tar.gz -C /backup dump && '
            'rm -rf /backup/dump"'
        ),
        docker_url='unix://var/run/docker.sock',
        network_mode='src_tfm_network',
        mounts=[Mount(source='C:/Users/marti/Desktop/TFM/src/.volumes/mongo-backup',
                      target='/backup', type='bind')],
        environment={
            'MONGO_INITDB_ROOT_USERNAME': 'admin',
            'MONGO_INITDB_ROOT_PASSWORD': 'admin'
        }
    )

    backup_task
