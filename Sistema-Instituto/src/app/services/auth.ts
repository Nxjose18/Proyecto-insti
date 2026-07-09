import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 login(){
    localStorage.setItem('sesion','true');
  }


  validarLogin(usuario:string, password:string){

    if(usuario === 'alumno@cieguitos.com' && password === '1234'){
      return 'alumno';
    }


    if(usuario === 'admin@cieguitos.com' && password === '1234'){
      return 'admin';
    }


    return null;

  }
    estaAutenticado(): boolean {
    return localStorage.getItem('sesion') === 'true';
  }



  logout(){
    localStorage.removeItem('sesion');
  }
}