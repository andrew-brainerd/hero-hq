use rodio::{Decoder, OutputStream, Sink};
use std::fs::File;
use std::io::BufReader;

pub fn play_sound(sound_path: &str, volume: f32) {
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let file = BufReader::new(File::open(sound_path).unwrap());
    let source = Decoder::new(file).unwrap();
    let sink = Sink::try_new(&stream_handle).unwrap();

    sink.set_volume(volume);
    sink.append(source);
    sink.sleep_until_end();
}

pub fn upload_complete() {
    play_sound("audio/upload-complete.mp3", 0.3);
}
