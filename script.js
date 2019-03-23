const POMODORO_STATES = {
  WORK: "work",
  REST: "rest"
};

const STATES = {
  STARTED: "started",
  STOPPED: "stopped",
  PAUSED: "paused"
};

const WORKING_TIME_LENGTH_IN_MINUTES = 2;
const RESTING_TIME_LENGTH_IN_MINUTES = 1;

new Vue({
  el: "#app",
  data: {
    minute: WORKING_TIME_LENGTH_IN_MINUTES,
    second: 0,
    pomodoroState: POMODORO_STATES.WORK,
    timestamp: 0,
    state: STATES.STOPPED,
    showCat: false,
    catImageUrl: ''
  },
  computed: {
    title: function() {
      return this.pomodoroState === POMODORO_STATES.WORK ? "Work!" : "Rest!";
    },
    min: function() {
      if (this.minute < 10) {
        return "0" + this.minute;
      } else {
        return this.minute;
      }
    },
    sec: function() {
      if (this.second < 10) {
        return "0" + this.second;
      } else {
        return this.second;
      }
    }
  },
  methods: {
    start: function() {
      this.state = STATES.STARTED;
      this._tick();
      this.interval = setInterval(this._tick, 1000);
      this.showCat = false;
      this.catImageUrl = "";
    },
    pause: function() {
      this.state = STATES.PAUSED;
      clearInterval(this.interval);
      axios.get("https://api.thecatapi.com/v1/images/search")
      .then(res => {
        this.catImageUrl = res.data[0].url
        this.showCat = true;
      })
      .catch(err => console.warn(err));
    },
    stop: function() {
      this.state = STATES.STOPPED;
      clearInterval(this.interval);
      this.pomodoroState = POMODORO_STATES.WORK;
      this.minute = WORKING_TIME_LENGTH_IN_MINUTES;
      this.second = 0;
      this.showCat = false;
      this.catImageUrl = "";
    },
    _tick: function() {
      if (this.second !== 0) {
        this.second -= 1;
        return;
      }
      if (this.minute !== 0) {
        this.minute -= 1;
        this.second = 59;
        return;
      }
      if (this.pomodoroState === "work") {
        this.pomodoroState = POMODORO_STATES.REST;
      } else {
        this.pomodoroState = POMODORO_STATES.WORK;
      }
      if (this.pomodoroState == POMODORO_STATES.WORK) {
        this.minute = WORKING_TIME_LENGTH_IN_MINUTES;
      } else {
        this.minute = RESTING_TIME_LENGTH_IN_MINUTES;
      }
    }
  }
});
