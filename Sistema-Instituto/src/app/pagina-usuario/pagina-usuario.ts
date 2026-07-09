import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

type OpcionUsuario = 'cursos' | 'historial' | 'datos';
type EstadoCurso = 'Inscrito' | 'Culminado';

interface CursoUsuario {
  codigo: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoCurso;
  nota?: number;
}

interface DatoUsuario {
  etiqueta: string;
  valor: string | number;
}

enum CategoriaCurso {
  InteligenciaArtificial = 'Inteligencia artificial',
}

@Component({
  standalone: true,
  selector: 'app-pagina-usuario',
  imports: [MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, CommonModule, FormsModule],
  templateUrl: './pagina-usuario.html',
  styleUrl: './pagina-usuario.css',
})
export class PaginaUsuario implements OnInit, OnDestroy {
  usuario: string = 'JOSE ANDRES';
  categoriaPrincipal: CategoriaCurso = CategoriaCurso.InteligenciaArtificial;
  opcionSeleccionada: OpcionUsuario = 'cursos';
  filtroHistorial: string = '';

  cursosInscritos: CursoUsuario[] = [
    this.crearCurso('AI-001'),
    this.crearCurso('AI-002'),
    this.crearCurso('AI-003'),
    this.crearCurso('AI-004'),
  ];

  cursosInteres: CursoUsuario[] = [this.crearCurso('AI-005'), this.crearCurso('AI-006')];

  historialCursos: CursoUsuario[] = Array.from({ length: 7 }, (_, indice) => ({
    ...this.crearCurso(`HIS-00${indice + 1}`),
    fechaInicio: '12/01/2026',
    fechaFin: '14/05/2026',
    estado: 'Culminado',
    nota: 18,
  }));

  datosUsuario: DatoUsuario[] = [
    { etiqueta: 'Nombre', valor: 'Jose Andres Ugarte Zerpa' },
    { etiqueta: 'Correo', valor: 'jose.andres@cieguetos.edu.pe' },
    { etiqueta: 'D.N.I', valor: 766611650 },
    { etiqueta: 'Carrera', valor: 'Introduccion a aplicaciones de i.a' },
    { etiqueta: 'Ciclo', valor: 'Ciclo 1' },
    { etiqueta: 'Codigo', valor: 'SM766611650' },
  ];

  private temporizadorMensaje?: ReturnType<typeof setTimeout>;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.temporizadorMensaje = setTimeout(() => undefined, 0);
  }

  ngOnDestroy(): void {
    if (this.temporizadorMensaje) {
      clearTimeout(this.temporizadorMensaje);
    }
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  // Cambia la vista activa usando Union Types para evitar opciones no validas.
  seleccionar(opcion: OpcionUsuario): void {
    this.opcionSeleccionada = opcion;
  }

  inscribirse(curso: CursoUsuario): void {
    if (!this.esCursoRegistrado(curso.codigo)) {
      this.cursosInscritos = [...this.cursosInscritos, curso];
    }
  }

  esCursoRegistrado(codigoCurso: string): boolean {
    return this.cursosInscritos.some((curso) => curso.codigo === codigoCurso);
  }

  obtenerPeriodo(curso: CursoUsuario): string {
    return `${curso.fechaInicio} - ${curso.fechaFin}`;
  }

  obtenerNota(curso: CursoUsuario): string {
    return typeof curso.nota === 'number' ? String(curso.nota) : 'NOTA';
  }

  get historialFiltrado(): CursoUsuario[] {
    const filtro = this.normalizarTexto(this.filtroHistorial);

    if (!filtro) {
      return this.historialCursos;
    }

    return this.historialCursos.filter((curso) =>
      this.normalizarTexto(`${curso.nombre} ${curso.descripcion} ${curso.fechaFin} ${this.obtenerNota(curso)}`).includes(filtro),
    );
  }

  get promedioHistorial(): number {
    const notas = this.historialCursos
      .map((curso) => curso.nota)
      .filter((nota): nota is number => typeof nota === 'number');

    if (!notas.length) {
      return 0;
    }

    const suma = notas.reduce((total, nota) => total + nota, 0);
    return Math.round(suma / notas.length);
  }

  get ultimoCursoCulminado(): string {
    return this.historialCursos[0]?.nombre ?? 'Sin cursos culminados';
  }

  private crearCurso(codigo: string, nombre: string = 'Desarrollo de i.a intermedio'): CursoUsuario {
    return {
      codigo,
      nombre,
      descripcion: 'Descripcion',
      fechaInicio: '12/05/2026',
      fechaFin: '20/07/2026',
      estado: 'Inscrito',
    };
  }

  private normalizarTexto(valor: string): string {
    return valor.trim().toLowerCase();
  }
}
