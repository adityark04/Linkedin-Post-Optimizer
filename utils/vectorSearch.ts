import { StyleLibraryItem } from '../types';

/**
 * Calculates the cosine similarity between two vectors.
 * @param vecA - The first vector.
 * @param vecB - The second vector.
 * @returns The cosine similarity score, from -1 to 1.
 */
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) {
    return 0;
  }
  return dotProduct / denominator;
};

/**
 * Performs a Maximal Marginal Relevance (MMR) search to find a set of documents
 * that are both relevant to the query and diverse among themselves.
 * @param queryEmbedding - The embedding of the search query.
 * @param library - The collection of style library items to search through.
 * @param lambda - A parameter to balance relevance (1.0) and diversity (0.0). Defaults to 0.7.
 * @param fetchN - The number of items to retrieve. Defaults to 3.
 * @returns An array of the selected style library items.
 */
export const maximalMarginalRelevanceSearch = (
  queryEmbedding: number[],
  library: StyleLibraryItem[],
  lambda: number = 0.7,
  fetchN: number = 3
): StyleLibraryItem[] => {
  if (library.length === 0 || fetchN === 0) {
    return [];
  }
  
  // Ensure we don't try to fetch more items than available
  const numToFetch = Math.min(fetchN, library.length);

  // Calculate initial relevance scores between the query and all items in the library
  const rankedByRelevance = library.map(item => ({
    item,
    relevance: cosineSimilarity(queryEmbedding, item.embedding),
  })).sort((a, b) => b.relevance - a.relevance);

  if (numToFetch === library.length) {
    return rankedByRelevance.map(r => r.item);
  }

  const selectedItems: StyleLibraryItem[] = [];
  const selectedEmbeddings: number[][] = [];
  const candidatePool = new Set(rankedByRelevance.map(r => r.item));

  // 1. Add the most relevant item to the selection first
  const firstItem = rankedByRelevance[0].item;
  selectedItems.push(firstItem);
  selectedEmbeddings.push(firstItem.embedding);
  candidatePool.delete(firstItem);

  // 2. Iteratively select the next items using the MMR score
  while (selectedItems.length < numToFetch && candidatePool.size > 0) {
    let bestCandidate: StyleLibraryItem | null = null;
    let bestMmrScore = -Infinity;

    const candidateItems = Array.from(candidatePool);

    for (const candidate of candidateItems) {
      // Calculate relevance of the candidate to the original query
      const relevance = cosineSimilarity(queryEmbedding, candidate.embedding);
      
      // Calculate the maximum similarity between the candidate and already selected items
      const maxSimilarityToSelected = Math.max(
        0, // handle case where selectedEmbeddings is empty
        ...selectedEmbeddings.map(selectedEmb => cosineSimilarity(candidate.embedding, selectedEmb))
      );

      // Calculate the MMR score
      const mmrScore = lambda * relevance - (1 - lambda) * maxSimilarityToSelected;

      if (mmrScore > bestMmrScore) {
        bestMmrScore = mmrScore;
        bestCandidate = candidate;
      }
    }
    
    if (bestCandidate) {
      selectedItems.push(bestCandidate);
      selectedEmbeddings.push(bestCandidate.embedding);
      candidatePool.delete(bestCandidate);
    } else {
      // This break is a safeguard in case no best candidate is found
      break;
    }
  }

  return selectedItems;
};
