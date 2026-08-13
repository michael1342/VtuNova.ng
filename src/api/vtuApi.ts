import http from './http'
import ApiError from './ApiError'
import {type vtuData } from '../interface/vtu.interface';
import { data } from 'react-router-dom';
import type { promises } from 'dns';

type vtuResponse = {
    success: boolean;
    error: string;
    response: any;
}

export const buyData = async (data: vtuData) : Promise<vtuResponse | undefined > => {
    try {
        const response = await http.post("/vtu/buy-data", {...data})
        if(!response) return 
        return {response, success: true, error: ''};
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, response: [] };
        }
        
    }
}

export const buyAirtime = async (data: vtuData) : Promise<vtuResponse | undefined > => {
    try {
        const response = await http.post("/vtu/buy-airtime", {...data})
        if(!response) return 
        return {response, success: true, error: ''};
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, response: [] };
        }
        
    }
}

export const getDataPlans = async (data: vtuData) : Promise<vtuResponse | undefined > => {
    try {
        const response = await http.get(`/vtu?serviceID=${encodeURIComponent(data.serviceID)}`)
        if(!response) return 
        return {response, success: true, error: ''};
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, response: [] };
        }
        
    }
}

export const verifyMeter = async (data: vtuData) : Promise<vtuResponse | undefined> => {
    try {
        const response = await http.post("/vtu/verify-meter-number", {...data})
        if(!response) return 
        return {response, success: true, error: ''};
    } catch (error) {
        if(error instanceof ApiError) {
            return {success: false, error: error.message, response: []}
        }
    }
}

export const buyElectricity = async (data: vtuData) : Promise<vtuResponse | undefined > => {
    try {
        const response = await http.post("/vtu/buy-electricity", {...data})
        if(!response) return 
        return {response, success: true, error: ''};
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, response: [] };
        }
        
    }
}