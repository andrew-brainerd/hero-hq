use aws_config::meta::region::RegionProviderChain;
use aws_sdk_s3::{Client, Error};
use log::info;

async fn create_client() -> Client {
    let region_provider = RegionProviderChain::default_provider().or_else("us-east-1");
    let config = aws_config::from_env().region(region_provider).load().await;
    let client = Client::new(&config);

    client
}

pub async fn get_bucket() -> Result<String, Error> {
    let client: Client = create_client().await;
    let resp = client.list_buckets().send().await?;
    let buckets = resp.buckets().unwrap_or_default();
    let num_buckets = buckets.len();
    let mut hq_bucket: String = "".to_owned();

    for bucket in buckets {
        hq_bucket = bucket.name().unwrap_or_default().to_string();
        info!("Bucket: {}", bucket.name().unwrap_or_default());
    }

    info!("Found {} bucket(s)", num_buckets);

    Ok(hq_bucket)
}
