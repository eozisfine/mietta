import {
  Container,
  Title,
  Text,
  Stack,
  Divider,
  List,
  Anchor,
  ListItem
} from '@mantine/core';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy e Cookie Policy | Mietta Corli',
  description: 'Informativa sulla privacy e cookie policy di Mietta Corli ai sensi del GDPR.',
};

export default function PrivacyPage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {/* INTESTAZIONE */}
        <div>
          <Title order={1} mb="md">Privacy Policy e Cookie Policy</Title>
          <Text c="dimmed" size="sm">
            Ultimo aggiornamento: Gennaio 2025
          </Text>
        </div>

        <Divider />

        {/* TITOLARE DEL TRATTAMENTO */}
        <section>
          <Title order={2} size="h3" mb="sm">1. Titolare del Trattamento</Title>
          <Text>
            Il Titolare del trattamento dei dati personali è:
          </Text>
          <Text mt="xs">
            <strong>Mietta Corli</strong><br />
            Email: <Anchor href="mailto:info@miettacorli.it">info@miettacorli.it</Anchor>
          </Text>
        </section>

        {/* TIPOLOGIE DI DATI RACCOLTI */}
        <section>
          <Title order={2} size="h3" mb="sm">2. Tipologie di Dati Raccolti</Title>
          <Text mb="sm">
            Fra i Dati Personali raccolti da questo sito web, in modo autonomo o tramite terze parti, ci sono:
          </Text>
          <List>
            <ListItem><strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, sistema operativo, pagine visitate, data e ora della visita</ListItem>
            <ListItem><strong>Dati forniti volontariamente:</strong> nome, cognome, email, telefono e messaggio inviati tramite form di contatto</ListItem>
            <ListItem><strong>Cookie:</strong> come descritto nella sezione Cookie Policy</ListItem>
          </List>
        </section>

        {/* FINALITA DEL TRATTAMENTO */}
        <section>
          <Title order={2} size="h3" mb="sm">3. Finalità del Trattamento</Title>
          <Text mb="sm">
            I dati personali sono raccolti per le seguenti finalità:
          </Text>
          <List>
            <ListItem><strong>Rispondere alle richieste:</strong> gestione delle richieste inviate tramite il form di contatto</ListItem>
            <ListItem><strong>Funzionamento del sito:</strong> garantire la corretta funzionalità tecnica del sito web</ListItem>
            <ListItem><strong>Obblighi di legge:</strong> adempiere agli obblighi previsti dalla normativa vigente</ListItem>
          </List>
        </section>

        {/* BASE GIURIDICA */}
        <section>
          <Title order={2} size="h3" mb="sm">4. Base Giuridica del Trattamento</Title>
          <Text>
            Il trattamento dei dati personali si basa su:
          </Text>
          <List>
            <ListItem><strong>Consenso:</strong> per l'invio di comunicazioni tramite form di contatto (Art. 6.1.a GDPR)</ListItem>
            <ListItem><strong>Legittimo interesse:</strong> per garantire la sicurezza e il funzionamento del sito (Art. 6.1.f GDPR)</ListItem>
            <ListItem><strong>Obbligo legale:</strong> per adempiere a obblighi di legge (Art. 6.1.c GDPR)</ListItem>
          </List>
        </section>

        {/* MODALITA DEL TRATTAMENTO */}
        <section>
          <Title order={2} size="h3" mb="sm">5. Modalità del Trattamento</Title>
          <Text>
            I dati personali sono trattati con strumenti informatici e/o telematici, con modalità organizzative e logiche strettamente correlate alle finalità indicate. Il trattamento avviene presso la sede del Titolare e presso i data center dei fornitori di servizi (Vercel Inc. per l'hosting).
          </Text>
          <Text mt="sm">
            Sono adottate adeguate misure di sicurezza per prevenire l'accesso non autorizzato, la divulgazione, la modifica o la distruzione non autorizzata dei dati.
          </Text>
        </section>

        {/* CONSERVAZIONE DEI DATI */}
        <section>
          <Title order={2} size="h3" mb="sm">6. Conservazione dei Dati</Title>
          <Text>
            I dati personali sono conservati per il tempo necessario a conseguire le finalità per cui sono stati raccolti:
          </Text>
          <List>
            <ListItem><strong>Dati di contatto:</strong> conservati per il tempo necessario a gestire la richiesta e per un massimo di 24 mesi</ListItem>
            <ListItem><strong>Dati di navigazione:</strong> conservati per un massimo di 14 mesi</ListItem>
          </List>
        </section>

        {/* COMUNICAZIONE DEI DATI */}
        <section>
          <Title order={2} size="h3" mb="sm">7. Comunicazione e Trasferimento dei Dati</Title>
          <Text mb="sm">
            I dati personali possono essere comunicati a:
          </Text>
          <List>
            <ListItem><strong>Vercel Inc.:</strong> fornitore del servizio di hosting (sede negli USA, aderente al Data Privacy Framework)</ListItem>
            <ListItem><strong>Consulenti e professionisti:</strong> per l'adempimento di obblighi contabili e fiscali</ListItem>
          </List>
          <Text mt="sm">
            I dati non saranno in alcun modo diffusi né ceduti a terzi per finalità di marketing.
          </Text>
        </section>

        {/* DIRITTI DELL'INTERESSATO */}
        <section>
          <Title order={2} size="h3" mb="sm">8. Diritti dell'Interessato</Title>
          <Text mb="sm">
            Ai sensi degli articoli 15-22 del GDPR, l'interessato ha diritto di:
          </Text>
          <List>
            <ListItem>Ottenere conferma dell'esistenza dei propri dati personali</ListItem>
            <ListItem>Accedere ai propri dati personali</ListItem>
            <ListItem>Ottenere la rettifica o la cancellazione dei dati</ListItem>
            <ListItem>Ottenere la limitazione del trattamento</ListItem>
            <ListItem>Opporsi al trattamento</ListItem>
            <ListItem>Richiedere la portabilità dei dati</ListItem>
            <ListItem>Revocare il consenso in qualsiasi momento</ListItem>
            <ListItem>Proporre reclamo all'Autorità Garante per la Protezione dei Dati Personali</ListItem>
          </List>
          <Text mt="sm">
            Per esercitare i propri diritti, l'interessato può inviare una richiesta a: <Anchor href="mailto:info@miettacorli.it">info@miettacorli.it</Anchor>
          </Text>
        </section>

        <Divider my="lg" />

        {/* COOKIE POLICY */}
        <section>
          <Title order={2} size="h2" mb="md">Cookie Policy</Title>

          <Title order={3} size="h4" mb="sm">Cosa sono i Cookie</Title>
          <Text mb="md">
            I cookie sono piccoli file di testo che i siti web salvano sul dispositivo dell'utente durante la navigazione. Vengono utilizzati per memorizzare informazioni e migliorare l'esperienza di navigazione.
          </Text>

          <Title order={3} size="h4" mb="sm">Tipologie di Cookie Utilizzati</Title>

          <Text fw={600} mt="md" mb="xs">Cookie Tecnici (necessari)</Text>
          <Text mb="sm">
            Questi cookie sono essenziali per il corretto funzionamento del sito e non possono essere disattivati. Includono:
          </Text>
          <List mb="md">
            <ListItem><strong>Cookie di sessione:</strong> gestiscono la navigazione e le preferenze dell'utente</ListItem>
            <ListItem><strong>Cookie di preferenza cookie:</strong> memorizzano le scelte dell'utente relative al consenso cookie</ListItem>
          </List>

          <Text fw={600} mt="md" mb="xs">Cookie di Terze Parti</Text>
          <Text mb="sm">
            Questo sito utilizza servizi di terze parti che potrebbero installare cookie:
          </Text>
          <List mb="md">
            <ListItem>
              <strong>Vercel Analytics (se attivo):</strong> per analizzare le prestazioni del sito in forma aggregata e anonima.
              <Anchor href="https://vercel.com/legal/privacy-policy" target="_blank" ml="xs">Privacy Policy Vercel</Anchor>
            </ListItem>
          </List>

          <Title order={3} size="h4" mb="sm">Gestione dei Cookie</Title>
          <Text mb="sm">
            L'utente può gestire le preferenze sui cookie tramite il banner visualizzato al primo accesso al sito, oppure modificando le impostazioni del proprio browser:
          </Text>
          <List>
            <ListItem><Anchor href="https://support.google.com/chrome/answer/95647" target="_blank">Google Chrome</Anchor></ListItem>
            <ListItem><Anchor href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop" target="_blank">Mozilla Firefox</Anchor></ListItem>
            <ListItem><Anchor href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank">Safari</Anchor></ListItem>
            <ListItem><Anchor href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank">Microsoft Edge</Anchor></ListItem>
          </List>
          <Text mt="sm" c="dimmed" size="sm">
            Nota: la disattivazione dei cookie tecnici potrebbe compromettere alcune funzionalità del sito.
          </Text>
        </section>

        <Divider my="lg" />

        {/* MODIFICHE */}
        <section>
          <Title order={2} size="h3" mb="sm">Modifiche alla Privacy Policy</Title>
          <Text>
            Il Titolare si riserva il diritto di apportare modifiche alla presente informativa in qualsiasi momento, dandone pubblicità agli utenti su questa pagina. Si prega di consultare periodicamente questa pagina per verificare eventuali aggiornamenti.
          </Text>
        </section>

        {/* CONTATTI */}
        <section>
          <Title order={2} size="h3" mb="sm">Contatti</Title>
          <Text>
            Per qualsiasi domanda o richiesta relativa alla presente Privacy Policy, è possibile contattare il Titolare all'indirizzo email: <Anchor href="mailto:info@miettacorli.it">info@miettacorli.it</Anchor>
          </Text>
        </section>
      </Stack>
    </Container>
  );
}
