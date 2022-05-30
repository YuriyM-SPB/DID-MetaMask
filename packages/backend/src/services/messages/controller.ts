import express, { Request, Response } from 'express';

let messages: Array<string> = [];

export const msg = (req: Request, res: Response) => {
    res.send(req.headers['content-type']);
    const message = req.headers['content-type'];
    if (message != undefined){
        messages.push(message);
    }
}

export const resp = (req: Request, res: Response) => {
    res.send(messages);
}

export const clear = (req: Request, res: Response) => {
    messages = [];
}