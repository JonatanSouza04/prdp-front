
export default class Helpers {

    static diff_hours(dt2, dt1) 
     {
            let diff =(dt2.getTime() - dt1.getTime()) / 1000;
            diff /= (60 * 60);
            return Math.abs(Math.round(diff));
    }
}