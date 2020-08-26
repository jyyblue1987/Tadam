

export const format_time = (seconds_time) => {
    var hour = Math.floor(seconds_time / 3600);
    var minute = Math.floor((seconds_time - 3600 * hour) / 60);
    var seconds = seconds_time - 3600 * hour - 60 * minute;
    var hour_str = "";
    var minute_str = "";
    var second_str = "";
    if(hour < 10) {
        hour_str = "0" + hour.toString();
    } else {
        hour_str = hour.toString();
    }
    if(minute < 10) {
        minute_str = "0" + minute.toString();
    } else {
        minute_str = minute.toString();
    }
    if(seconds < 10) {
        seconds_str = "0" + seconds.toString();
    } else {
        seconds_str = seconds.toString();
    }
    return hour_str + ":" + minute_str + ":" + seconds_str
}