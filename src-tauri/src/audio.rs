use log::info;
use rodio::source::SineWave;
use rodio::{Decoder, OutputStream, Sink, Source};
use std::fs::File;
use std::io::BufReader;
use std::time::Duration;

pub fn play_song(directory: &str) {
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let song_path = format!("{}\\song.ogg", directory);
    info!("Playing song from {}", song_path);
    let file = File::open(&song_path).unwrap();
    let song = stream_handle.play_once(BufReader::new(file)).unwrap();

    info!("Starting song {}", song_path);

    // song.set_volume(1.0);
    // song.play();
    song.detach();
}

pub fn play_song_sink() {
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let sink = Sink::try_new(&stream_handle).unwrap();
    let source = SineWave::new(420.0)
        .take_duration(Duration::from_secs_f32(1.50))
        .amplify(0.20);

    sink.append(source);
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
    play_sound("audio/jazz.mp3");
}
