import http from './http'
import ApiError from './ApiError'
import {type vtuData } from '../interface/vtu.interface';
import type { VtuResponse } from '../interface/api.interface';
import generateRequestID from '../utils/generateRequestID';

export type { VtuResponse as vtuResponse } from '../interface/api.interface';

export const buyData = async (data: vtuData) : Promise<VtuResponse | undefined > => {
    try {
        const request_id = generateRequestID();
        const response = await http.post("/vtu/buy-data", {...data, request_id})
        if(!response) return 
        return {response, success: true, error: ''};
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, response: [] };
        }
        
    }
}

export const buyAirtime = async (data: vtuData) : Promise<VtuResponse | undefined > => {
    try {
        const request_id = generateRequestID();
        const response = await http.post("/vtu/buy-airtime", {...data, request_id})
        // if(!response) return 
        console.log(response)
        return {response, success: true, error: ''};
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, response: [] };
        }
        
    }
}

export const getDataPlans = async (data: vtuData) : Promise<VtuResponse | undefined > => {
    try {
        const response = await http.get(`/vtu?serviceID=${encodeURIComponent(data.serviceID ?? '')}`)
        if(!response) return 
        return {response, success: true, error: ''};
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, response: [] };
        }
        
    }
}

export const verifyMeter = async (data: vtuData) : Promise<VtuResponse | undefined> => {
    try {
        const request_id = generateRequestID();
        const response = await http.post("/vtu/verify-meter-number", {...data, request_id})
        if(!response) return 
        return {response, success: true, error: ''};
    } catch (error) {
        if(error instanceof ApiError) {
            return {success: false, error: error.message, response: []}
        }
    }
}

export const buyElectricity = async (data: vtuData) : Promise<VtuResponse | undefined > => {
    try {
        const request_id = generateRequestID();
        const response = await http.post("/vtu/buy-electricity", {...data, request_id})
        if(!response) return 
        return {response, success: true, error: ''};
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, response: [] };
        }
        
    }
}