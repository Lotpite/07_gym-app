import React, { FC } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { AccountContainer } from '../../styles/Account.styled';
import { ProfileChart } from '../Profile/ProfileChart';
import { ProfileDaily } from '../Profile/ProfileDaily';
import { ProfileHeader } from '../Profile/ProfileHeader';
import { ProfileNavigation } from '../Profile/ProfileNavigation';
import { ProfileProgress } from '../Profile/ProfileProgress';

export const Account: FC = () => {
  const user = useSelector((state: RootState) => state.user)

  return (
    <AccountContainer>
      <ProfileHeader workoutsQty={user.gym.trainings.length}/>
      <ProfileProgress/>
      <ProfileDaily todaysWorkout={user.gym.trainings[0]}/>
      <ProfileChart/>
      <ProfileNavigation/>
    </AccountContainer>
  )
}   
