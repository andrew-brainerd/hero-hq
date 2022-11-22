use serde::Deserialize;

pub async fn get_request<T: for<'de> Deserialize<'de>>(request_url: &str) -> Result<T, ()> {
  println!("GET {}", request_url);
  let response = reqwest::get(request_url)
      .await
      .unwrap()
      .json::<T>()
      .await
      .unwrap();

  Ok(response)
}
