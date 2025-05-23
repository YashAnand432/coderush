'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Header/ProblemPageNavbar'
import Workspace from '@/components/Workspace/Workspace'
import axios from 'axios'



const Page = () => {

  const [users, setUsers] = useState<any>();
  const [problems, setProbelems] = useState<any>();

  const getUser = async () => {
    let responce = await axios.get('../../../api/utils/verifiedUserDetails');
    setUsers(responce.data.user);
    // console.log(responce.data.user);
  }

  const getProblems = async () => {
    const rest = await axios.get('../../../api/utils/problemSets');
    setProbelems(rest.data.data);
    // console.log(res.data.data);
  }

  useEffect(() => {
    getUser();
    getProblems();
  }, [])


  return (
    <div>
      <Navbar problems={problems} />
      <Workspace users={users} problems={problems} />
    </div>
  )
}

export default Page
