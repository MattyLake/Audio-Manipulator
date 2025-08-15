import { Howl, Howler } from "howler"

var sound = new Howl({
  src: ['../audio/vineboom.wav']
});

sound.play();