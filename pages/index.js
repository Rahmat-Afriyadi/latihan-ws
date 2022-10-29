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
  const [res, setRes] = useState([])

  function handleSubmit(){
    console.log("test")
    socket.emit('notice', msg)
  }

  const socketInitializer = async () => {
    // await fetch('http://localhost:8000/socket.io');

    socket = io("http://localhost:8000")

    socket.on('/', () => {
      console.log('connected')
    })

    socket.on('reply', msg => {
      console.log("hasil")
      setRes(res => ([...res, msg]))
    })
  }
    
  useEffect(()=>{
    socketInitializer()
  },[])

  return (
    <>
      {/* <AblyChatComponent/> */}
      <input className='border-black border' type="text" name="pesan" onChange={(e)=>{setMessage(e.target.value)}}/>
      <button onClick={handleSubmit}>kirim</button>

      {

        res.map((el,index)=>{
          return (
            <p key={index} className='text-xl'>{el}</p>
          )
        })
      }
    </>
  )
}
