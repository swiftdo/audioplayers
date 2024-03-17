import 'dart:async';

import 'package:audioplayers_platform_interface/audioplayers_platform_interface.dart';

abstract class WebPlayer {
  // ignore: close_sinks
  final eventStreamController = StreamController<AudioEvent>.broadcast();

  num? getPlayerCurrentTime();

  num? getPlayerDuration();

  Future<void> setUrl(String url);

  set volume(double volume);

  set balance(double balance);

  set playbackRate(double rate);

  void recreateNode();

  bool shouldLoop();

  set releaseMode(ReleaseMode releaseMode);

  void release();

  Future<void> start(double position);

  Future<void> resume();

  void pause();

  void stop();

  void seek(int position);

  void log(String message);

  Future<void> dispose();
}
