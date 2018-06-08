const config = require('config')

/**
 * Découpe le texte en paragraphes, justifie chaque paragraphe et retourne ainsi le texte justifié
 * @param {string} paragraphs : contenu du texte 
 */
module.exports.justify = function(paragraphs) {
  return paragraphs.split('\n').map((paragraph) => justifyParagraph(paragraph)).join('\n')
}

/**
 * Découpe le paragraphe en plusieurs lignes, justifie chaque ligne et retourne ainsi le paragraphe justifié
 * @param {string} text : contenu d'un paragraphe
 */
function justifyParagraph(text) {
  let offset = 0
  const lines = [];

  // On découpe le paragraphe en plusieurs lignes
  // Tant qu'on est avant la fin du paragraphe
  while (offset <= text.length) {
    let length = config.lineLength
    let lineAdded = false
    // On cherche une ligne d'une taille maximale de config.lineLength
    // On considère la chaine de caractères de longueur lineLength (en node pas de out of bounds) commencant à l'offset
    // Tant que l'on a pas trouvé une ligne et que la chaîne de caractères n'est pas vide
    while (!lineAdded && length > 0) {
      const nextChar = text[offset + length]
      const line = text.substring(offset, offset + length)
      // Si le caractère d'après la chaîne de caractère est un espace  ou qu'on à déjà atteint le bout du paragraphe (on s'assure qu'on est pas en plein milieu d'un mot)
      // La chaîne examinée est rajoutée dans le tableau de lignes et on bouge l'offset après le caractère d'après (qui est un espace ou la fin du paragraphe)
      // Sinon on raccourci la chaîne d'un caractère
      if (!nextChar || nextChar === ' ') {
        lines.push(line)
        offset += length + 1
        lineAdded = true
      } else {
        length--
      }
    }

    // Si aucune ligne n'a été ajoutée c'est que le mot dépassait config.lineLength caractères
    // on tronque les config.lineLength premiers caractères et on le considère comme une ligne
    if (length === 0) {
      lines.push(text.substring(offset, offset + config.lineLength))
      offset += config.lineLength + 1
    }
  }
  return lines.map((line, index) => index === lines.length - 1 ? line : justifyLine(line)).join('\n')
}

/**
 * Retourne la ligne justifiée
 * @param {string} text : contenu d'une ligne
 */
function justifyLine(text) {
  const spaces = config.lineLength - text.length
  let justifiedLine = ''

  // Si il n'y a pas d'espace à rajouter, retourne directement la ligne
  if (spaces === 0) { return text }
  const words = text.split(' ')
  // On calcule le nombre d'espace à rajouter en plus entre chaque mot (valeur décimale)
  const rate = spaces / (words.length - 1)
  let acc = 0
  let addedSpacesNumber = 0
  // Entre chaque mot on insère on rajouter le nombre d'espace adéquat
  for (let i = 0; i < words.length - 1; i++) {
    const word = words[i]
    acc += rate
    // Par pallier entier d'espace à rajouter, on rajoute le nombre adéquat par rapport au précédent pallier franchit
    // On rajoute à l'accumulateur 0.00000000000009 dans l'évaluation du palier car les nombres sont tronqués à la 14e décimale
    // Dans le cas d'un nombre comme 1/3, on a 0,33333333333333 et ainsi 3 * 0,33333333333333 = 0.99999999999999
    // ce qui nous empêche de franchir notre pallier
    const spaceNumber = Math.floor(acc + 0.00000000000009) - addedSpacesNumber
    addedSpacesNumber += spaceNumber
    justifiedLine = `${justifiedLine}${word}${' '.repeat(spaceNumber + 1)}`
  }
  justifiedLine = `${justifiedLine}${words[words.length - 1]}`

  return justifiedLine
}
