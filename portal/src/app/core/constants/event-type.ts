export const EventType = Object.freeze({
  AccessDenied: 'AccessDenied',
  AccessGranted: 'AccessGranted',
  EntryAssumed: 'EntryAssumed',
  EntryDetected: 'EntryDetected'
});

export const EventTypeLabels = Object.freeze({
  AuthorizedEntrance: 'Entrada autorizada',
  AuthorizedExit: 'Saída autorizada',
  DeniedEntrance: 'Entrada negada',
  DeniedExit: 'Saída negada',
  BusExit: 'Saída via ônibus',
  BusEntrance: 'Entrada via ônibus'
});
