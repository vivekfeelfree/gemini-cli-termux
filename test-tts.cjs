
const { spawn } = require('node:child_process');

console.log('Testing TTS spawn...');

try {
  const child = spawn('termux-tts-speak', [], {
    stdio: ['pipe', 'inherit', 'inherit'], // Inherit stdout/stderr to see errors
    detached: true,
  });

  child.on('error', (err) => {
    console.error('Spawn error:', err);
  });

  child.on('exit', (code) => {
    console.log(`Child exited with code ${code}`);
  });

  child.stdin.write('This is a test of the auto speak feature.');
  child.stdin.end();
  
  // Keep alive briefly to ensure we see start
  setTimeout(() => {
      console.log('Test script finishing...');
      child.unref();
  }, 1000);

} catch (e) {
  console.error('Exception:', e);
}
