function turingMachine(input) {
    let tape = input.split('');
    
    let head = 0;
  
    while (tape[head] !== '+' && head < tape.length) {
      head++;
    }
  
    tape.splice(head, 1);
  
    return tape.join('');
  }
  
  let input = "111+11";
  let output = turingMachine(input);
  console.log("Output:", output); // Output: 11111
  