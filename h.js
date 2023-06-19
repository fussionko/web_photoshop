let data = document.getElementsByTagName("body")[0].innerText.split("\n");
console.log(data);

let word = {
    "word" : null,
    "metdata" : null,
};
let all_guesses = [];

function getPossible(guess, metadata)
{
  let possible = [];
  // word["word"] = input;
  // word["metdata"] = metadata;

  for(let i = 0; i < data.length; i++)
  {
    if(data[i].length != guess.length) continue;
    if(check(guess, metadata, data[i]) == 1)
      possible.push(data[i]);
  }

  word["word"] = guess;
  word["metadata"] = metadata;
  all_guesses.push(word);
  if(possible.length != 0)
    data = possible;

  console.log(possible);
}

function check(guess, metadata, data_word)
{
  let check = 1;
  for(let word_i = 0; word_i < metadata.length; word_i++)
  {
    if(metadata[word_i] == '0')
    {
      if(data_word.includes(guess[word_i]))
      {
        check = 0;
        break;
      }
    }

    else if(metadata[word_i] == '1')
    {
      if(!data_word.includes(guess[word_i]))
      {
        check = 0;
        break;
      }
    }
    else if(metadata[word_i] == '2')
    {
      if(data_word[word_i] != guess[word_i])
      {
        check = 0;
        break;
      }
    }    
  }
  return check;
}

