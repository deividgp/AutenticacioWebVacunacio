# v1.0.0
Aquesta aplicació permet introduir totes les dades automàticament (requereix configuració prèvia) a la pàgina https://vacunacovid.catsalut.gencat.cat per poder comprovar la disponibilitat dels punts de vacunació arreu de Catalunya.

Per fer-ho és necessari:

-Baixar el repositori, instal·lar https://nodejs.org (preferiblement l'última versió) i executar la comanda npm install a la carpeta arrel del projecte.

-Omplir l'arxiu .env (example) (s'ha d'eliminar el " (example)" perquè funcioni) amb les dades corrrectes:

* CIP: pot ser true (utilitza el CIP de la targeta sanitària individual) o false (utilitza el DNI)

* ID: pot ser el CIP o el DNI segons el camp anterior

* PHONE: número de mòbil que la web utilitzarà per enviar-te el SMS

* NAME: nom

* SURNAME: primer cognom

* SURNAME2: segon cognom

* MAIL: correu (s'ha d'utilitzar el mateix correu pel formulari i per l'enviament de SMS, segurament ho canviaré en versions posteriors)

* MAILPASS: la contrassenya del correu

* MAILHOST: el host imap del proveïdor de correu

* MAILPORT: el port del host imap del proveïdor de correu

- Instal·lar l'aplicació https://play.google.com/store/apps/details?id=com.gawk.smsforwarder en el mateix dispositiu del número indicat anteriorment. Per configurar-la es fa de la manera següent:

* A l'inici de l'aplicació seleccionar el botó "+"

* Introduir el correu

* (opcional) Si l'aplicació diu que requereix configuració addicional tornar a l'inici, settings->via smtp, configurar el correu amb el protocol smtp i tornar al pas 1

* Seleccionar el "check"

* Assegurar-se de que a la safata de notificacions del dispositiu hi ha una campana

-Executar la comanda node src/index.js a la carpeta arrel del projecte.

NOTA1: per aconseguir les credencials dels protocols imap i smpt del host s'ha d'utilitzar Google.

NOTA2: per ara només he provat l'aplicació amb un coreu Outlook amb el SSL desactivat a la configuració de l'aplicació. Si pot ser es recomana utilitzar aquest.

----

Esta aplicación permite introducir todos los datos automáticamente (requiere configuración previa) en la página https://vacunacovid.catsalut.gencat.cat para poder comprobar la disponibilidad de los puntos de vacunación en Cataluña.

Para ello es necesario:

-Bajar el repositorio, instalar https://nodejs.org (preferiblemente la última versión) y ejecutar el comando npm install en la carpeta raíz del proyecto.

-Rellenar el archivo .env (example) (se debe eliminar el " (example)" para que funcione) con los datos correctos:

* CIP: puede ser true (utiliza el CIP de la tarjeta sanitaria individual) o false (utiliza el DNI)

* ID: puede ser el CIP o el DNI según el campo anterior

* PHONE: número de móvil que la web utilizará para enviarte el SMS

* NAME: nombre

* Surname: primer apellido

* SURNAME2: segundo apellido

* MAIL: correo (se utilizará el mismo correo el formulario y para el envío de SMS, seguramente lo cambiaré en versiones posteriores)

* MAILPASS: la contraseña del correo

* MAILHOST: el host imap del proveedor de correo

* MAILPORT: el puerto del host imap del proveedor de correo

-Instalar la aplicación https://play.google.com/store/apps/details?id=com.gawk.smsforwarder en el mismo dispositivo del número indicado anteriormente. Para configurarla se hace de la manera siguiente:

* Al inicio de la aplicación seleccionar el botón "+"

* Introducir el correo

* (Opcional) Si la aplicación dice que requiere configuración adicional volver al inicio, settings-> vía smtp, configurar el correo con el protocolo smtp y volver al paso 1

* Seleccionar el "check"

* Asegurarse de que en la bandeja de notificaciones del dispositivo hay una campana

-Ejecutar la comanda node src/index.js en la carpeta raíz del proyecto.

Nota1: para conseguir las credenciales de los protocolos IMAP y SMPT del host debe utilizarse Google.

Nota2: por ahora sólo he probado la aplicación con un correo Outlook con el SSL desactivado en la configuración de la aplicación. Si puede ser se recomienda utilizar este.

# Pròxims canvis

-Poder executar aquesta aplicació cada X temps (preferiblement cada 5-10 minuts).

-Enviament de notificacions per correu si l'aplicació troba un centre disponible en una localitat incluïda entre les especificades per l'usuari.

-Reservar automàticament en una franja concreta.

# Próximos cambios

-Poder ejecutar esta aplicación cada X tiempo (preferiblemente cada 5-10 minutos).

-Envío de notificaciones por correo si la aplicación encuentra un centro disponible en una localidad incluida entre las especificadas por el usuario.

-Reserva automáticamente en una franja concreta.
