import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import {
  styled,
  Typography,
  Slider,
  Paper,
  Stack,
  Box,
  IconButton,
} from '@mui/material';

// Importing icons
import {
  VolumeDown as VolumeDownIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  VolumeMute as VolumeMuteIcon,
  Pause as PauseIcon,
  FastRewind as FastRewindIcon,
  FastForward as FastForwardIcon,
  PlayArrow as PlayArrowIcon,
  SkipNext as SkipNextIcon,
  SkipPrevious as SkipPreviousIcon,

  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';




const Div = styled('div')(({ theme }) => ({
  backgroundColor: 'black',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  paddingTop: theme.spacing(6),
}));

const VideoContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1, 
  position: 'relative', 
}));

const CustomPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'black',
  marginLeft: theme.spacing(6),
  marginRight: theme.spacing(6),
  padding: theme.spacing(2),
}));

const PSlider = styled(Slider)(({ theme, ...props }) => ({
  color: 'lime',
  height: 2,
  '&:hover': {
    cursor: 'auto',
  },
  '& .MuiSlider-thumb': {
    width: '13px',
    height: '13px',
    display: props.thumbless ? 'none' : 'block',
  },
}));


const MinimizedPlayer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  width: '300px',
  aspectRatio: '16 / 9',
  backgroundColor: '#4c4c4c',
  border: '1px solid lime',
  zIndex: 1000, // Ensuring it stays on top
}));





const playlist = [
  { url: 'https://www.youtube.com/watch?v=G2W4IlwDRp0', type: 'video' },
  { url: 'https://soundcloud.com/saketh-reddy-481723832/pedavulu-palike?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing', type: 'audio' },
  { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', type: 'audio' },
  { url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', type: 'video' },
  {url:'https://www.youtube.com/watch?v=uYPbbksJxIg&pp=ygULb3BwZW5oZWltZXI%3D', type: 'video'},
  // Just wrote types so we can understand them in code, the player recognises it dynamically without the need of type
];





export default function Mediaplayer() {
  const mediaRef = useRef();

  const [showControls, setShowControls] = useState(false); // State to track mouse hover
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [mute, setMute] = useState(false);

  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);


  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true); // Show controls on mouse movement
      if (mediaRef.current && mediaRef.current.paused) {
        setShowControls(true); // Keep controls visible if player is paused
      }
    };

    const hideControlsTimeout = setTimeout(() => {
      setShowControls(false); // Hide controls after 10 seconds of inactivity
    }, 10000);

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(hideControlsTimeout);
    };
  }, [isPlaying]);

  // Function to toggle showControls state on mouse enter and leave
  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    setShowControls(false);
  };

  useEffect(() => {
    if(mediaRef){
        mediaRef.current.volume = volume / 100;
    }

    
    if(isPlaying){
        setInterval(() => {
            const _duration = Math.floor(mediaRef?.current?.getDuration());
            const _elapsed = Math.floor(mediaRef?.current?.getCurrentTime());

            setDuration(_duration);
            setElapsed(_elapsed);
        }, 100);
    }

    }, [
        volume, isPlaying
    ]);


  function formatTime(time) {
    if(time && !isNaN(time)){
        const minutes = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
        const seconds = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);

        return `${minutes}:${seconds}`;
    }
    return '00:00';
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          setShowControls(true);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((prevVolume) => Math.min(prevVolume + 10, 100));
          setShowControls(true);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((prevVolume) => Math.max(prevVolume - 10, 0));
          setShowControls(true);
          break;
        case 'ArrowRight':
          e.preventDefault();
          toggleForward();
          setShowControls(true);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          toggleBackward();
          setShowControls(true);
          break;
        case 'm':
          e.preventDefault();
          if (mute) { 
            setMute(prev => !prev);
            setVolume(30);
            setShowControls(true);
          }
          else{
            setMute(prev => !prev);
            setShowControls(true);
          }
          break;
        case 'n':
          e.preventDefault();
          toggleSkipForward();
          setShowControls(true);
          break;
        case 'p':
          e.preventDefault();
          toggleSkipBackward();
          setShowControls(true);
          break;
        // case 'f':
        //   e.preventDefault();
        //   toggleFullScreen();
        //   break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mute]);


  // Custom controls
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleForward = () => {
    // console.log(mediaRef.current.getCurrentTime())
    mediaRef.current.seekTo(mediaRef.current.getCurrentTime() + 10);

  };

  const toggleBackward = () => {
    // console.log(mediaRef.current.getCurrentTime())
    mediaRef.current.seekTo(mediaRef.current.getCurrentTime() - 10);
  };

  const toggleSkipForward = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const toggleSkipBackward = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };


  const handlePlaybackSpeedChange = (event, newValue) => {
    setPlaybackSpeed(newValue);
  };


  const handleProgressClick = (event, newValue) => {
    mediaRef.current.seekTo(newValue);
    setElapsed(formatTime(newValue));
  };


  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  const toggleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      mediaRef.current.wrapper.requestFullscreen();
    }
    setIsFullScreen((prev) => !prev);
  };



  const VolumeBtns = () => {
    if (mute) {
      return (
        <VolumeOffIcon
          sx={{ color: 'lime', '&:hover': { color: 'white' } }}
          onClick={() => setMute(!mute)}
        />
      );
    } else if (volume <= 20) {
      return (
        <VolumeMuteIcon
          sx={{ color: 'lime', '&:hover': { color: 'white' } }}
          onClick={() => setMute(!mute)}
        />
      );
    } else if (volume <= 75) {
      return (
        <VolumeDownIcon
          sx={{ color: 'lime', '&:hover': { color: 'white' } }}
          onClick={() => setMute(!mute)}
        />
      );
    } else {
      return (
        <VolumeUpIcon
          sx={{ color: 'lime', '&:hover': { color: 'white' } }}
          onClick={() => setMute(!mute)}
        />
      );
    }
  };

  return (
    <Div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <VideoContainer>
      {isMinimized ? (
        <MinimizedPlayer>
          <ReactPlayer
            ref={mediaRef}
            url={playlist[currentIndex].url}
            playing={isPlaying}
            muted={mute}
            playbackRate={playbackSpeed}
            volume={volume / 100}
            width="100%"
            height="100%"
            controls={false}
            onDuration={(d) => setDuration(Math.floor(d))}
            onProgress={(p) => setElapsed(Math.floor(p.playedSeconds))}
          />
          <Stack direction="row" justifyContent="space-between" p={1}>
            <IconButton onClick={toggleMinimize} sx={{ color: 'lime' }}>
              <FullscreenExitIcon />
            </IconButton>
            <IconButton onClick={togglePlay} sx={{ color: 'lime' }}>
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Stack>
        </MinimizedPlayer>
      ) : (
        <ReactPlayer
          ref={mediaRef}
          url={playlist[currentIndex].url}
          playing={isPlaying}
          muted={mute}
          playbackRate={playbackSpeed}
          volume={volume / 100}
          width={isFullScreen ? '100vw' : '100%'} // Fullscreen width
          height={isFullScreen ? '100vh' : '100%'} // Fullscreen height
          controls={false}
          onDuration={(d) => setDuration(Math.floor(d))}
          onProgress={(p) => setElapsed(Math.floor(p.playedSeconds))}
        />
      )}
      </VideoContainer>

      {!isMinimized && showControls && (
        <CustomPaper>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              width: '25%',
              alignItems: 'center',
            }}
          >
            <VolumeBtns />

            <PSlider min={0} max={100} value={volume} onChange={(e, v) => setVolume(v)} />
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: 'flex',
              width: '40%',
              alignItems: 'center',
            }}
          >
            <SkipPreviousIcon
              sx={{
                color: 'lime',
                '&:hover': { color: 'white' },
              }}
              onClick={toggleSkipBackward}
              disables={true}/>
              
            <FastRewindIcon sx={{ color: 'lime', '&:hover': { color: 'white' } }} onClick={toggleBackward} />

            {!isPlaying ? (
              <PlayArrowIcon fontSize={'large'} sx={{ color: 'lime', '&:hover': { color: 'white' } }} onClick={togglePlay} />
            ) : (
              <PauseIcon fontSize={'large'} sx={{ color: 'lime', '&:hover': { color: 'white' } }} onClick={togglePlay} />
            )}

            <FastForwardIcon sx={{ color: 'lime', '&:hover': { color: 'white' } }} onClick={toggleForward} />
            <SkipNextIcon sx={{ color: 'lime', '&:hover': { color: 'white' } }} onClick={toggleSkipForward} />
          </Stack>

          <Stack
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
              <IconButton onClick={toggleFullScreen} sx={{ color: 'lime' }}> FullScreen:
                {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={toggleMinimize} sx={{ color: 'lime' }}>
                Minimize:
                <FullscreenIcon />
              </IconButton>

            <Typography sx={{ color: 'lime', paddingRight: '10px' }}>Speed:{playbackSpeed}</Typography>
            <PSlider
              min={0.5}
              max={4}
              step={0.25}
              value={playbackSpeed}
              onChange={handlePlaybackSpeedChange}
            />
          </Stack>
        </Box>
        <Stack
          spacing={1}
          direction="row"
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ color: 'lime' }}>{formatTime(elapsed)}</Typography>
          <PSlider thumbless value={elapsed} max={duration} onChange={handleProgressClick}/>
          <Typography sx={{ color: 'lime' }}>{formatTime(duration)}</Typography>
        </Stack>
      </CustomPaper>
      )}
    </Div>
  );
}