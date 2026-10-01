import { setAdmin, setMember } from "../db/queries.js";


export function getJoinClub(req, res, next) {
    if (req.user.is_member) {
        return res.redirect('/')
    }
    res.render('join-club')
}

export async function postJoinClub(req, res, next) {
    try {
        const code = req.body.code.trim().toLowerCase()
        const passcode = process.env.MEMBER_PASSCODE.toLowerCase();
        console.log(code);
        console.log(passcode);
        
      if (code !== passcode) {
        return res.status(400).render('join-club', { error: 'Wrong passcode' });
      }
      await setMember(req.user.id);
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  }
  
export function getBecomeAdmin(req, res, next) {
    if (req.user.is_admin) {
        return res.redirect('/')
    }
    res.render("become-admin")
}


export async function postBecomeAdmin(req, res, next) {
    try {
        if (req.body.code !== process.env.ADMIN_PASSCODE) {
        return res.status(400).render('become-admin', { error: 'Wrong passcode' });
        }
        await setAdmin(req.user.id);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
    }


export function postPiano(req, res) {
    if (req.body.notes === process.env.PIANO_SEQUENCE) {
        return res.json({ word: process.env.MEMBER_PASSCODE });
    }
    res.status(400).json({ word: null });
    }

export function getPiano(req, res) {
    const notes = process.env.PIANO_SEQUENCE.split(',');
    res.render('piano', {
        sequence: notes.join(' '),
        sequenceLength: notes.length,
    });
    }