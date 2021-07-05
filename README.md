# v1.0.0
Aquesta aplicació permet introduir totes les dades de automàticament (requereix configuració prèvia) a la pàgina https://vacunacovid.catsalut.gencat.cat per poder comprovar la disponibilitat dels punts de vacunació arreu de Catalunya.

Per fer-ho és necessari:

-Baixar el repositori, instal·lar https://nodejs.org (preferiblement l'última versió) i executar la comanda npm install.

-Omplir l'arxiu .env (example) (s'ha d'eliminar el " (example)" perquè funcioni) amb les dades corrrectes:

*CIP: pot ser true (utilitza el CIP de la targeta sanitària individual) o false (utilitza el DNI)

*ID: pot ser el CIP o el DNI segons el camp anterior

*PHONE: número de mòbil que la web utilitzarà per enviar-te el SMS

*NAME: nom

*SURNAME: primer cognom

*SURNAME2: segon cognom

*MAIL: correu (s'ha d'utilitzar el mateix correu pel formulari i per l'enviament de SMS, segurament ho canviaré en versions posteriors)

*MAILPASS: la contrassenya del correu

*MAILHOST: el host imap del proveïdor de correu

*MAILPORT: el port del host imap del proveïdor de correu

-Instal·lar l'aplicació https://play.google.com/store/apps/details?id=com.gawk.smsforwarder en el mateix dispositiu del número indicat anteriorment. Per configurar-la es fa de la manera següent:

*A l'inici de l'aplicació seleccionar el botó "+"

*Introduir el correu

*(opcional) Si l'aplicació diu que requereix configuració addicional tornar a l'inici, settings->via smtp, configurar el correu amb el protocol smtp i tornar al pas 1

*Seleccionar el "check"

*Assegurar-se de que a la safata de notificacions del dispositiu hi ha una campana

NOTA1: per aconseguir les credencials dels protocols imap i smpt del host s'ha d'utilitzar Google.

NOTA2: per ara només he provat l'aplicació amb un coreu Outlook amb el SSL desactivat a la configuració de l'aplicació. Si pot ser es recomana utilitzar aquest.
