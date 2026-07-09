import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

type OpcionAdmin = 'estudiantes' | 'cursos' | 'datos';
type CodigoRegistro = string | number;

interface PersonaBase {
  codigo: string;
  nombre: string;
}

interface Estudiante extends PersonaBase {
  correo: string;
  contrasena: string;
  dni: string;
  telefono: string;
  carrera: string;
  ciclo: string;
  curso: string;
}

interface CursoAdmin extends PersonaBase {
  descripcion: string;
  inicio: string;
  fin: string;
}

class RegistroBase {
  constructor(public codigo: CodigoRegistro) {}

  obtenerCodigo(): string {
    return String(this.codigo);
  }
}

class RegistroCurso extends RegistroBase {
  constructor(
    codigo: CodigoRegistro,
    public nombre: string,
  ) {
    super(codigo);
  }
}

@Component({
  standalone: true,
  selector: 'app-pagina-admin',
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './pagina-admin.html',
  styleUrl: './pagina-admin.css',
})
export class PaginaAdmin implements OnInit, OnDestroy {
  usuario: string = 'JOSE ANDRES';
  opcionSeleccionada: OpcionAdmin = 'estudiantes';
  filtroEstudiante: string = '';
  filtroCurso: string = '';
  mensajeRegistro: string = '';

  nuevoEstudiante: Estudiante = this.crearEstudiante();
  nuevoCurso: CursoAdmin = this.crearCurso();

  estudiantes: Estudiante[] = [
    this.crearEstudiante('SM766611650'),
    this.crearEstudiante('SM766611651'),
    this.crearEstudiante('SM766611652'),
  ];

  cursos: CursoAdmin[] = [
    this.crearCurso('SM766611650'),
    this.crearCurso('SM766611651'),
    this.crearCurso('SM766611652'),
  ];

  private temporizadorGuardado?: ReturnType<typeof setTimeout>;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.temporizadorGuardado = setTimeout(() => undefined, 0);
  }

  ngOnDestroy(): void {
    if (this.temporizadorGuardado) {
      clearTimeout(this.temporizadorGuardado);
    }
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  seleccionar(opcion: OpcionAdmin): void {
    this.opcionSeleccionada = opcion;
    this.mensajeRegistro = '';
  }

  registrarEstudiante(): void {
    if (!this.tieneTexto(this.nuevoEstudiante.nombre)) {
      this.mensajeRegistro = 'Ingrese el nombre del estudiante.';
      return;
    }

    if (this.existeEstudiante(this.nuevoEstudiante)) {
      this.mensajeRegistro = 'El estudiante ya se encuentra registrado.';
      return;
    }

    this.estudiantes = [...this.estudiantes, { ...this.nuevoEstudiante }];
    this.nuevoEstudiante = this.crearEstudiante(this.generarCodigo());
    this.mensajeRegistro = 'Estudiante registrado correctamente.';
  }

  registrarCurso(): void {
    if (!this.tieneTexto(this.nuevoCurso.nombre)) {
      this.mensajeRegistro = 'Ingrese el nombre del curso.';
      return;
    }

    if (this.existeCurso(this.nuevoCurso)) {
      this.mensajeRegistro = 'El curso ya se encuentra registrado.';
      return;
    }

    const registro = new RegistroCurso(this.nuevoCurso.codigo, this.nuevoCurso.nombre);
    this.cursos = [...this.cursos, { ...this.nuevoCurso, codigo: registro.obtenerCodigo() }];
    this.nuevoCurso = this.crearCurso(this.generarCodigo());
    this.mensajeRegistro = 'Curso registrado correctamente.';
  }

  generarCodigo(): string {
    const numeroBase: number = 766611650 + this.estudiantes.length + this.cursos.length;
    return `SM${numeroBase}`;
  }

  editarRegistro(registro: Estudiante | CursoAdmin): void {
    if (this.esEstudiante(registro)) {
      this.nuevoEstudiante = { ...registro };
      this.opcionSeleccionada = 'estudiantes';
      return;
    }

    this.nuevoCurso = { ...registro };
    this.opcionSeleccionada = 'cursos';
  }

  eliminarEstudiante(codigo: string): void {
    this.estudiantes = this.estudiantes.filter((estudiante) => estudiante.codigo !== codigo);
    this.mensajeRegistro = 'Estudiante eliminado correctamente.';
  }

  eliminarCurso(codigo: string): void {
    this.cursos = this.cursos.filter((curso) => curso.codigo !== codigo);
    this.mensajeRegistro = 'Curso eliminado correctamente.';
  }

  obtenerPeriodo(curso: CursoAdmin): [string, string] {
    return [curso.inicio, curso.fin];
  }

  get estudiantesFiltrados(): Estudiante[] {
    const filtro = this.normalizarTexto(this.filtroEstudiante);

    if (!filtro) {
      return this.estudiantes;
    }

    return this.estudiantes.filter((estudiante) =>
      this.normalizarTexto(`${estudiante.codigo} ${estudiante.nombre} ${estudiante.curso} ${estudiante.ciclo}`).includes(filtro),
    );
  }

  get cursosFiltrados(): CursoAdmin[] {
    const filtro = this.normalizarTexto(this.filtroCurso);

    if (!filtro) {
      return this.cursos;
    }

    return this.cursos.filter((curso) =>
      this.normalizarTexto(`${curso.codigo} ${curso.nombre} ${curso.inicio} ${curso.fin}`).includes(filtro),
    );
  }

  private tieneTexto(valor: unknown): valor is string {
    return typeof valor === 'string' && valor.trim().length > 0;
  }

  private esEstudiante(registro: Estudiante | CursoAdmin): registro is Estudiante {
    return 'correo' in registro;
  }

  private existeEstudiante(estudianteNuevo: Estudiante): boolean {
    return this.estudiantes.some((estudiante) =>
      this.normalizarTexto(estudiante.codigo) === this.normalizarTexto(estudianteNuevo.codigo) ||
      this.normalizarTexto(estudiante.nombre) === this.normalizarTexto(estudianteNuevo.nombre) ||
      (this.tieneTexto(estudianteNuevo.correo) && this.normalizarTexto(estudiante.correo) === this.normalizarTexto(estudianteNuevo.correo)) ||
      (this.tieneTexto(estudianteNuevo.dni) && this.normalizarTexto(estudiante.dni) === this.normalizarTexto(estudianteNuevo.dni)),
    );
  }

  private existeCurso(cursoNuevo: CursoAdmin): boolean {
    return this.cursos.some((curso) =>
      this.normalizarTexto(curso.codigo) === this.normalizarTexto(cursoNuevo.codigo) ||
      this.normalizarTexto(curso.nombre) === this.normalizarTexto(cursoNuevo.nombre),
    );
  }

  private normalizarTexto(valor: string): string {
    return valor.trim().toLowerCase();
  }

  private crearEstudiante(codigo: string = 'SM766611650'): Estudiante {
    return {
      codigo,
      nombre: 'JOSE ANDRES UGARTE ZERPA',
      correo: '',
      contrasena: '',
      dni: '',
      telefono: '',
      carrera: 'INTRODUCCION A APLICACIONES DE I.A',
      ciclo: 'CICLO 1',
      curso: 'INTRODUCCION A APLICACIONES DE I.A',
    };
  }

  private crearCurso(codigo: string = 'SM766611650'): CursoAdmin {
    return {
      codigo,
      nombre: 'DESARROLLO DE I.A',
      descripcion: '',
      inicio: '12/05/2026',
      fin: '20/07/2026',
    };
  }
}
