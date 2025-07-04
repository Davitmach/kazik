'use client'
import { QueryClient } from "@tanstack/react-query";
import initWebApp from '@twa-dev/sdk';
import type TelegramWebApp from 'telegram-webapp-types';

import axios from "axios";

class Bet {
    async getRandom() {
        var domen = process.env.NEXT_PUBLIC_DOMEN;
        if(domen) {
const data = await axios.get(domen+'/api/drop/list');
if(data.data) {
    return data.data
}
        }
    }
    async spin() {
         var domen = process.env.NEXT_PUBLIC_DOMEN;
         if(domen) {
    const spin =await axios.get(domen+'/api/drop/random',{
        headers:{
            "X-Telegram-InitData": window.Telegram.WebApp.initData 
        }
    })
    if(spin.data) {
        return spin.data;
    }
         }
    }
}
export const bet = new Bet()