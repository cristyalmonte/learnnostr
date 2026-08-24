document$.subscribe(() => {
  const target = document.querySelector('#typewriter')
  if (
    !target ||
    target.dataset.typewriterInitialized === 'true' ||
    typeof Typewriter === 'undefined'
  ) return

  target.dataset.typewriterInitialized = 'true'

  const strings = document.documentElement.lang === 'es'
    ? ['Nostr.', 'un protocolo abierto.', 'identidad soberana.', 'sin intermediarios.']
    : ['Nostr.', 'an open protocol.', 'sovereign identity.', 'without middlemen.']

  new Typewriter(target, {
    strings,
    autoStart: true,
    loop: true,
    delay: 55,
    deleteSpeed: 30,
    pauseFor: 1800,
  })
})