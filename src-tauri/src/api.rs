use serde::Deserialize;

pub async fn get_request<T: for<'de> Deserialize<'de>>(request_url: &str) -> Result<T, ()> {
  // let request_url = "https://chorus.fightthe.pw/api/random";
  // let request_url = "https://gist.githubusercontent.com/andrew-brainerd/3dfff32d608bec81685d04b6f662d609/raw/6f3b632d7d991a73e36b83cbe09bb0fb382e9786/song.json";
  println!("GET {}", request_url);
  let response = reqwest::get(request_url)
      .await
      .unwrap()
      .json::<T>()
      .await
      .unwrap();

  Ok(response)
}
