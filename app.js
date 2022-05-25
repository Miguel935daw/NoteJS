const { throws } = require("assert");
const prompt = require('prompt')
const xml2js = require('xml2js')
var fs = require("fs"),
  parseString = require("xml2js").parseString;

fs.readFile("notasJS.xml", "utf-8", function (err, data) {
  if (err) console.log(err);
  console.log(data);
  parseString(data, function (err, resultado) {
    if (err) console.log(err);
    console.log('Bienvenido/a a la app de notas \n Introduce uno de los siguientes números según lo que quieras hacer: \n Para mostrar todas las notas: 0 \n Para crear una nueva nota: 1 \n Para modificar una nota ya existente: 2 \n Para buscar una frase o palabra entre las notas guardadas: 3')
    prompt.start()
    prompt.get(['accion'], function (err, accion) {
      switch (parseInt(accion.accion)) {
        case 0:
          show_all(resultado);
          break;
        case 1:
          new_note(resultado);
          break;
        case 2:
          modify(resultado);
          break;
        case 3:
          search(resultado);
          break;
        default:
          throw err;
      }
    })
  });
});


function personal_creator(file) {
  prompt.start()
  let identificador = parseInt(file.notas.personales[0].personal.at(-1).ID) + 1
  let fecha = new Date(Date.now()).toLocaleDateString()
  prompt.get(['titulo', 'contenido', 'favorito'], function (err, entradas) {
    if (err) throw err;
    if (entradas.favorito != 'true' && entradas.favorito != 'false') {
      console.log('El campo favorito solo puede ser true o false')
      throw err;
    }
    file.notas.personales[0].personal.push({
      ID: identificador,
      titulo: entradas.titulo,
      contenido: entradas.contenido,
      fecha: fecha,
      favorito: entradas.favorito
    })
    const constructor = new xml2js.Builder()
    const NuevaNota = constructor.buildObject(file)
    fs.writeFile('notasJS.xml', NuevaNota, (err) => {
      if (err) throw err
      console.log('La nueva Nota Personal fue creada con éxito\n')
    }
    )
  })
}

function profesional_creator(file) {
  prompt.start()
  let identificador = parseInt(file.notas.profesionales[0].profesional.at(-1).ID) + 1
  prompt.get(['proyecto', 'departamento', 'empresa', 'fechaentrega'], function (err, entradas) {
    let fecha = new Date(entradas.fechaentrega).toLocaleDateString()
    if (fecha == 'Invalid Date') {
      console.log('No has introducido una fecha válida')
      throw err;
    }
    if (err) throw err;
    file.notas.profesionales[0].profesional.push({
      ID: identificador,
      proyecto: entradas.proyecto,
      departamento: entradas.departamento,
      empresa: entradas.empresa,
      fechaentrega: fecha
    })

    const constructor = new xml2js.Builder()
    const NuevaNota = constructor.buildObject(file)
    fs.writeFile('notasJS.xml', NuevaNota, (err) => {
      if (err) throw err
      console.log('La nueva Nota Profesional fue creada con éxito\n')
    }
    )
  })
}

function domestica_creator(file) {
  prompt.start()
  let identificador = parseInt(file.notas.tareasdomesticas[0].tareadomestica.at(-1).ID) + 1
  prompt.get(['titulotarea', 'check', 'prioridad'], function (err, entradas) {
    if (err) throw err;
    if (entradas.check != 'true' && entradas.check != 'false') {
      console.log('El campo check solo puede ser true o false')
      throw err;
    }
    if (entradas.prioridad != 'Alta' && entradas.prioridad != 'Media' && entradas.prioridad != 'Baja') {
      console.log('El campo prioridad  solo puede ser: Alta, Media, Baja')
      throw err;
    }
    file.notas.tareasdomesticas[0].tareadomestica.push({
      ID: identificador,
      titulotarea: entradas.titulotarea,
      check: entradas.check,
      prioridad: entradas.prioridad
    })
    const constructor = new xml2js.Builder()
    const NuevaNota = constructor.buildObject(file)
    fs.writeFile('notasJS.xml', NuevaNota, (err) => {
      if (err) throw err
      console.log('La nueva Nota doméstica fue creada con éxito\n')
    }
    )
  })
}

function new_note(file) {
  prompt.start()
  console.log('Introduce el numero asociado a la categoría en la que quieres añadir una nueva nota')
  console.log('Personal -> 1')
  console.log('Profesional -> 2')
  console.log('Domestica -> 3')
  prompt.get(['Categoria'], function (err, categoria) {
    switch (parseInt(categoria.Categoria)) {
      case 1:
        personal_creator(file);
        break;
      case 2:
        profesional_creator(file);
        break;
      case 3:
        domestica_creator(file);
        break;
      default:
        console.log('El número introducido no está asociado a ninguna categoria')
        throw err;
    }
  })

}

function show_all(file) {
  console.log('\nNotas ' + 'Personales' + ':')
  file.notas.personales.forEach(function (persona) {
    persona.personal.forEach(function (nota) {
      console.log('ID: ' + nota.ID)
      console.log('Título: ' + nota.titulo)
      console.log('Fecha: ' + nota.fecha)
      console.log('Contenido: ' + nota.contenido)
      if (nota.favoritos == 'false') {
        console.log('☆\n')
      } else {
        console.log('★\n')
      }
    })
  })
  console.log('\nNotas ' + 'Profesional' + ':')
  file.notas.profesionales.forEach(function (profesiona) {
    profesiona.profesional.forEach(function (nota) {
      console.log('ID: ' + nota.ID)
      console.log('Proyecto: ' + nota.proyecto)
      console.log('Departamento: ' + nota.departamento)
      console.log('Empresa: ' + nota.empresa)
      console.log('Fecha de Entrega: ' + nota.fechaentrega + '\n')
    })
  })
  console.log('\nNotas ' + 'Domésticas' + ':')
  file.notas.tareasdomesticas.forEach(function (tarea) {
    tarea.tareadomestica.forEach(function (nota) {
      console.log('ID: ' + nota.ID)
      console.log('Titulo de la Tarea: ' + nota.titulotarea)
      if (nota.check == 'false') {
        console.log('□')
      } else { console.log('☑') }
      console.log('Prioridad: ' + nota.prioridad + '\n')
    })
  })
}

function modify(file) {
  console.log('Introduce el numero asociado a la categoria a la que pertenece la nota que quieres modificar, además de su ID')
  console.log('Personal -> 1')
  console.log('Profesional -> 2')
  console.log('Domestica -> 3')
  prompt.start()
  prompt.get(['categoria', 'ID'], function (err, entradas) {
    if (comprobar_ID(entradas.categoria, entradas.ID)) {
      switch (parseInt(entradas.categoria)) {
        case 1:
          file.notas.personales.forEach(function (persona) {
            persona.personal.forEach(function (nota) {
              if (nota.ID == entradas.ID) {
                console.log('Para modificar los siguientes campos introduce los números que se indican')
                console.log('Titulo -> 1')
                console.log('Contenido -> 2')
                console.log('Favoritos -> 3')
                prompt.get(['Elemento'], function (err, entradas2) {
                  switch (parseInt(entradas2.Elemento)) {
                    case 1:
                      prompt.get(['Titulo'], function (err, entradas3) {
                        nota.titulo = entradas3.Titulo
                        const constructor = new xml2js.Builder()
                        const NuevaNota = constructor.buildObject(file)
                        fs.writeFile('notasJS.xml', NuevaNota, (err) => {
                          if (err) throw err
                          console.log('La Nota fue modificada con éxito\n')
                        })
                      })
                      break;
                    case 2:
                      prompt.get(['Contenido'], function (err, entradas4) {
                        nota.contenido = entradas4.Contenido
                        const constructor = new xml2js.Builder()
                        const NuevaNota = constructor.buildObject(file)
                        fs.writeFile('notasJS.xml', NuevaNota, (err) => {
                          if (err) throw err
                          console.log('La Nota fue modificada con éxito\n')
                        }
                        )
                      })
                      break;
                    case 3:
                      console.log('Los campos Favoritos y Check solo pueden tener el valor: true o false')
                      prompt.get(['Favorito'], function (err, entradas5) {
                        if (err) throw err;
                        if (entradas5.Favorito != 'true' && entradas5.Favorito != 'false') {
                          console.log('El campo favorito solo puede ser true o false')
                          throw err;
                        }
                        nota.favoritos = entradas5.Favorito
                        const constructor = new xml2js.Builder()
                        const NuevaNota = constructor.buildObject(file)
                        fs.writeFile('notasJS.xml', NuevaNota, (err) => {
                          if (err) throw err
                          console.log('La Nota fue modificada con éxito\n')
                        }
                        )
                      })
                      break;
                  }
                })
              }
            })
          })
          break;
        case 2:
          file.notas.profesionales.forEach(function (persona) {
            persona.profesional.forEach(function (nota) {
              if (nota.ID == entradas.ID) {
                console.log('Para modificar los siguientes campos introduce los números que se indican')
                console.log('Proyecto -> 1')
                console.log('Departamento -> 2')
                console.log('Empresa -> 3')
                console.log('Fecha de Entrega -> 4')
                prompt.get(['Elemento'], function (err, entradas2) {
                  switch (parseInt(entradas2.Elemento)) {
                    case 1:
                      prompt.get(['Proyecto'], function (err, entradas3) {
                        nota.proyecto = entradas3.Proyecto
                        const constructor = new xml2js.Builder()
                        const NuevaNota = constructor.buildObject(file)
                        fs.writeFile('notasJS.xml', NuevaNota, (err) => {
                          if (err) throw err
                          console.log('La Nota fue modificada con éxito\n')
                        }
                        )
                      })
                      break;
                    case 2:
                      prompt.get(['Departamento'], function (err, entradas4) {
                        nota.departamento = entradas4.Departamento
                        const constructor = new xml2js.Builder()
                        const NuevaNota = constructor.buildObject(file)
                        fs.writeFile('notasJS.xml', NuevaNota, (err) => {
                          if (err) throw err
                          console.log('La Nota fue modificada con éxito\n')
                        }
                        )
                      })
                      break;
                    case 3:
                      prompt.get(['Empresa'], function (err, entradas5) {
                        nota.empresa = entradas5.Empresa
                        const constructor = new xml2js.Builder()
                        const NuevaNota = constructor.buildObject(file)
                        fs.writeFile('notasJS.xml', NuevaNota, (err) => {
                          if (err) throw err
                          console.log('La Nota fue modificada con éxito\n')
                        }
                        )
                      })
                      break;
                    case 4:
                      prompt.get(['FechaEntrega'], function (err, entradas6) {
                        let fecha = new Date(entradas6.FechaEntrega).toLocaleDateString()
                        if (fecha == 'Invalid Date') {
                          console.log('No has introducido una fecha válida')
                          throw err;
                        }
                        if (err) throw err;
                        nota.fechaentrega = fecha
                        const constructor = new xml2js.Builder()
                        const NuevaNota = constructor.buildObject(file)
                        fs.writeFile('notasJS.xml', NuevaNota, (err) => {
                          if (err) throw err
                          console.log('La Nota fue modificada con éxito\n')
                        }
                        )
                      })
                      break;
                  }
                })
              }
            })
          })
          break;
        case 3:
          file.notas.tareasdomesticas.forEach(function (persona) {
            persona.tareadomestica.forEach(function (nota) {
              if (nota.ID == entradas.ID) {
                console.log('Para modificar los siguientes campos introduce los números que se indican')
                console.log('Titulo de la Tarea -> 1')
                console.log('Check -> 2')
                console.log('Prioridad -> 3')
                prompt.get(['Elemento'], function (err, entradas2) {
                  switch (parseInt(entradas2.Elemento)) {
                    case 1:
                      prompt.get(['Titulo'], function (err, entradas3) {
                        nota.titulotarea = entradas3.Titulo
                        const constructor = new xml2js.Builder()
                        const NuevaNota = constructor.buildObject(file)
                        fs.writeFile('notasJS.xml', NuevaNota, (err) => {
                          if (err) throw err
                          console.log('La Nota fue modificada con éxito\n')
                        }
                        )
                      })
                      break;
                    case 2:
                      console.log('Los campos Favoritos y Check solo pueden tener el valor: true o false')
                      prompt.get(['Check'], function (err, entradas4) {
                        if (err) throw err;
                        if (entradas4.Check != 'true' && entradas4.Check != 'false') {
                          console.log('El campo favorito solo puede ser true o false')
                          throw err;
                        }
                        nota.check = entradas4.Check
                        const constructor = new xml2js.Builder()
                        const NuevaNota = constructor.buildObject(file)
                        fs.writeFile('notasJS.xml', NuevaNota, (err) => {
                          if (err) throw err
                          console.log('La Nota fue modificada con éxito\n')
                        }
                        )
                      })
                      break;
                    case 3:
                      prompt.get(['Prioridad'], function (err, entradas5) {
                        if (entradas5.Prioridad != 'Alta' && entradas5.Prioridad != 'Media' && entradas5.Prioridad != 'Baja') {
                          console.log('El campo prioridad  solo puede ser: Alta, Media, Baja')
                          throw err;
                        }
                        nota.prioridad = entradas5.Prioridad
                        const constructor = new xml2js.Builder()
                        const NuevaNota = constructor.buildObject(file)
                        fs.writeFile('notasJS.xml', NuevaNota, (err) => {
                          if (err) throw err
                          console.log('La Nota fue modificada con éxito\n')
                        }
                        )
                      })
                      break;
                  }
                })
              }
            })
          })
          break;
        default:
          console.log('No se ha encontrado ninguna nota con el ID introducido en esta categoría')
          throw err;
      }
    } else {
      console.log('Has introducido una categoria o ID inválido')
      throw err;
    }
  })
}

function comprobar_ID(categoria, identificador) {
  if (parseInt(identificador) > categoria.length) {
    console.log('Has introducido un ID que no corresponde a ninguna nota')
    return false
  }
  else return true
}

function search(file) {
  let comprobador = false
  prompt.start()
  console.log('Introduce la palabra o frase que buscas: ')
  prompt.get(['busqueda'], function (err, entradas) {
    if (err) throw err;
    file.notas.personales.forEach(function (persona) {
      persona.personal.forEach(function (nota) {
        if (nota.ID.includes(entradas.busqueda) || nota.titulo.includes(entradas.busqueda) || nota.fecha.includes(entradas.busqueda) ||
          nota.contenido.includes(entradas.busqueda)) {
          comprobador = true
          console.log('ID: ' + nota.ID)
          console.log('Título: ' + nota.titulo)
          console.log('Fecha: ' + nota.fecha)
          console.log('Contenido: ' + nota.contenido)
          if (nota.favoritos == 'false') {
            console.log('☆\n')
          } else {
            console.log('★\n')
          }
        }
      })
    })
    file.notas.profesionales.forEach(function (profesiona) {
      profesiona.profesional.forEach(function (nota) {
        if (nota.ID.includes(entradas.busqueda) || nota.proyecto.includes(entradas.busqueda) || nota.departamento.includes(entradas.busqueda)
          || nota.fechaentrega.includes(entradas.busqueda)) {
          comprobador = true
          console.log('ID: ' + nota.ID)
          console.log('Proyecto: ' + nota.proyecto)
          console.log('Departamento: ' + nota.departamento)
          console.log('Empresa: ' + nota.empresa)
          console.log('Fecha de Entrega: ' + nota.fechaentrega + '\n')
        }
      })
    })
    file.notas.tareasdomesticas.forEach(function (tarea) {
      tarea.tareadomestica.forEach(function (nota) {
        {
          if (nota.ID.includes(entradas.busqueda) || nota.titulotarea.includes(entradas.busqueda) || nota.check.includes(entradas.busqueda)
            || nota.prioridad.includes(entradas.busqueda)) {
            comprobador = true
            console.log('ID: ' + nota.ID)
            console.log('Titulo de la Tarea: ' + nota.titulotarea)
            if (nota.check == 'false') {
              console.log('□')
            } else { console.log('☑') }
            console.log('Prioridad: ' + nota.prioridad + '\n')
          }
        }
      })
    })
    if (comprobador == false) console.log('La palabra o frase introducida no se ha encontrado en ninguna de las notas guardadas')
  })
}
