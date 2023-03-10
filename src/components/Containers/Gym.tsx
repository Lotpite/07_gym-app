import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../hooks/redux'
import { IExercise, ISet, ITraining } from '../../models/IGym'
import { addDate, addExs, addSetToExs } from '../../store/slices/train/train.slice'
import { RootState } from '../../store/store'
import { GymContainer, GymContent } from '../../styles/Gym.styled'
import { Cooling } from '../Gym/Cooling'
import { Finish } from '../Gym/Finish'
import { NewSet } from '../Gym/Set'
import { useNavigate } from 'react-router-dom'
import { Button } from '../UI/Button'

export const Gym = () => {

  const navigate = useNavigate();

  const lazyCount = (activeSet: number) => { 
    let newCount = currentProgram.exercises[activeExercise].sets.find( item => item.order === activeSet)
    return newCount ? newCount.reps : 5
  }

  const user = useSelector((state: RootState) => state.user)
  const newTrain: ITraining = useSelector((state: RootState) => state.train)
  const dispatch = useAppDispatch();

  const currentProgram = user.gym.trainings[user.gym.trainings.length - 1]

  const [isCooling, setIsCooling] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [disable, setDisable] = useState(false);

  const [activeSet, setActiveSet] = useState(4)
  const [activeExercise, setActiveExercise] = useState(0)
  const [count, setCount] = useState<number>(() => lazyCount(activeSet))

  const [newTraining, setNewTraining] = useState({})

  useEffect(() => {
    console.log(newTrain);

  }, [count, activeSet, isFinished])

  const setReps = (activeSet: number) => {
    let newCount = currentProgram.exercises[activeExercise].sets.find( item => item.order === activeSet)
    newCount && setCount(newCount.reps) 
  } 

  const addExercise = () => {
    let currentExercise = newTrain.exercises.find(item => item.id === currentProgram.exercises[activeExercise].id)
    
    if(currentExercise) {
      dispatch(addSetToExs({
        exsId: activeExercise, 
        order: activeSet, 
        reps: count,
      }))
    } else {
      let newExercise = {
        id: currentProgram.exercises[activeExercise].id,
        total: count,
        sets: [
          {order: activeSet, reps: count}
        ],
        active: false
      }
      // newTrain.exercises.push(newExercise)
      dispatch(addExs(newExercise))
    }
  }

  const done = () => {

    if(activeSet === currentProgram.exercises[activeExercise].sets.length) {
      setActiveSet(1)
      setReps(1)

      if(activeExercise === currentProgram.exercises.length - 1) {
        let date = new Date().toLocaleDateString()
        dispatch(addDate(date))
        setActiveExercise(0)
        setIsFinished(true)

      } else {
        setActiveExercise(activeExercise + 1)
        setIsCooling(true)
        setDisable(true)
      }

    } else {
      setActiveSet(activeSet + 1)
      setReps(activeSet+1)
      setIsCooling(true)
      setDisable(true)
    }

    addExercise()
    console.log('done');
  }

  const change = (x: number) => {
    let newCount = count + x

    if(newCount < 0 ) {
      return setCount(0)
    }

    if(newCount > 99) {
      alert('Do not lie to me')
      return setCount(99)
    }
   
      setCount(newCount)
    
  }

  const disableCooling = () => {
    setIsCooling(false)
  }

  const activateButton = () => {
    setDisable(false)
  }

  const finish = () => {
    setIsFinished(false)
    navigate('/home')
  }

//! Need to realize function finnish for finnish button
//! Need to realize function finnish for finnish button
//! Need to realize function finnish for finnish button

  return (
    <GymContainer>
        <GymContent>
          {
            isFinished 
            ? <Finish iconName='finish'
            trainingsCount={user.gym.trainings.length}/>
            : isCooling 
            ? <Cooling iconName='cooling' func={activateButton}/>
            : <NewSet exerciseName={currentProgram.exercises[activeExercise].id}
            exercisesList={currentProgram.exercises[activeExercise].sets}
            repsCount={count}
            activeSet={activeSet}
            func={change}
            />
        
          }

          <Button text={isFinished ? 'Finish' : isCooling ? 'Continue' : 'Done'}
           isDisabled={disable}
            func={isFinished ? finish : isCooling ? disableCooling : done}/>
        </GymContent>
    </GymContainer>
  )
}
