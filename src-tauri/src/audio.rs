use rodio::{
    source::{SineWave, Source},
    Decoder, OutputStream, Sink,
};
use std::fs::File;
use std::io::BufReader;
use std::time::Duration;

pub fn play_song(directory: &str, duration: u64) {
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let song_path = format!("{}/song.ogg", directory);
    let file = BufReader::new(File::open(song_path).unwrap());
    let source = Decoder::new(file).unwrap();
    
    play_song_sink(source);
    // stream_handle.play_raw(source.convert_samples());
    // std::thread::sleep(std::time::Duration::from_secs(duration));
}

pub fn play_song_sink(source: Decoder<BufReader<File>>) {
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let sink = Sink::try_new(&stream_handle).unwrap();

    // Add a dummy source of the sake of the example.
    // let source = SineWave::new(440.0)
    //     .take_duration(Duration::from_secs_f32(0.25))
    //     .amplify(0.20);
    sink.append(source);

    // The sound plays in a separate thread. This call will block the current thread until the sink
    // has finished playing all its queued sounds.
    sink.sleep_until_end();
}

pub fn play_sound(sound_path: &str) {
  let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let file = BufReader::new(File::open(sound_path).unwrap());
    let source = Decoder::new(file).unwrap();
    let sink = Sink::try_new(&stream_handle).unwrap();

    sink.append(source);
    sink.sleep_until_end();
}

pub fn upload_complete() {
  play_sound("audio/upload-complete.mp3");
}

