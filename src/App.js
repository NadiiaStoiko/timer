import React,{useState, useEffect} from 'react';
import './App.css';
import { interval, Subject } from 'rxjs';
import {
  startWith,
  takeUntil,
  share,
  map,
  filter,
  buffer,
  debounceTime
} from 'rxjs/operators';


function App() {
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

  useEffect(() => {

    const click$ = new Subject();

    const doubleClick$ = click$.pipe(
    buffer(
      click$.pipe(debounceTime(300))
    ),
    map(list => {
      return list.length;
    }),
    filter(x => x === 2),
  )


    const unsubscribe$=new Subject();

    interval(10)
    .pipe(
      startWith(0),
      takeUntil(unsubscribe$),
      takeUntil(doubleClick$)
  )
    .pipe(share())
    .subscribe(()=>{
      if (timerOn) {
        setTime(time => time + 10);
      }
    })
    
    return () => {
    unsubscribe$.next();
    unsubscribe$.complete();
    doubleClick$.next()
    doubleClick$.complete();
    }
  }, [timerOn]);

  const startStopFunc=()=>{
    if(!timerOn){
      setTimerOn(true)
    }else{
      setTimerOn(false)
      setTime(0)
    }
  }

  const resetFunc=()=>{
      setTimerOn(false)
      setTime(0)
    if(time===0){
    setTimerOn(true)
    }
  }

  const waitFunc=()=>{
      setTimerOn(false)
  }

  return (
    <div className="container">
      <div className='timer'>
        <span>{('0'+Math.floor((time/60000)%60)).slice(-2)}:</span>
        <span>{('0'+Math.floor((time/1000)%60)).slice(-2)}:</span>
        <span>{('0'+((time/10)%100)).slice(-2)}</span>
      </div>
      < div className="btn-container">
        <button className='btn'onClick={startStopFunc}>{timerOn ? `STOP` : `START`}</button>
        <button className='btn'onClick={waitFunc}>{`WAIT`}</button>
        <button className='btn'onClick={resetFunc}>{`RESET`}</button>
      </div>
    </div>
  );
}

export default App;