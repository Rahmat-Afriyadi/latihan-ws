import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
const { io } = require("socket.io-client");
let socket;
import dynamic from 'next/dynamic'

const AblyChatComponent = dynamic(() => import('../components/AblyChatComponent'), { ssr: false });

export default function Home() {

  const [msg, setMessage] = useState("")
  const [res, setRes] = useState("")

  function handleSubmit(){
    socket.emit('input-change', msg)
  }

  const socketInitializer = async () => {
    await fetch('/api/socket');

    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-input', msg => {
      setRes(msg)
    })
  }
    
  useEffect(()=>{
    socketInitializer()
  },[])

  return (
    <>
      <AblyChatComponent/>
      <input className='border-black border' type="text" name="pesan" onChange={(e)=>{setMessage(e.target.value)}}/>
      <button onClick={handleSubmit}>kirim</button>

      <p className='text-xl'>{res}</p>
    </>
  )
}
