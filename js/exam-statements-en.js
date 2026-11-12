/* English statements for the 200-minute rehearsal.
   Each pack translates the portal's own Japanese wording.
   These are not Codility's problem text. */
window.EXAM_STATEMENTS_EN = {
  "unpaired": {
    "title": "The value with no pair",
    "sentences": [
      {
        "id": "s1",
        "text": "A non-empty array A of N integers is given. N is odd."
      },
      {
        "id": "s2",
        "text": "Exactly one value in A occurs an odd number of times. Every other value occurs an even number of times."
      },
      {
        "id": "s3",
        "text": "The function solution, given A, returns that value. It does not return an index or a count."
      },
      {
        "id": "s4",
        "text": "For example, given A = [9, 3, 9, 3, 9, 7, 9], the value 9 occurs four times, 3 occurs twice and 7 occurs once, so the function returns 7."
      }
    ],
    "example": "A[0] = 9\nA[1] = 3\nA[2] = 9\nA[3] = 3\nA[4] = 9\nA[5] = 7\nA[6] = 9\n\nthe function returns 7",
    "assumptions": [
      {
        "id": "a1",
        "text": "N is an odd integer within the range [1..1,000,000]."
      },
      {
        "id": "a2",
        "text": "Each element of array A is an integer within the range [1..1,000,000,000]."
      },
      {
        "id": "a3",
        "text": "Exactly one value occurs an odd number of times."
      }
    ]
  },
  "passing": {
    "title": "Cars that pass each other",
    "sentences": [
      {
        "id": "s1",
        "text": "Array A describes N cars on one road, ordered from west to east."
      },
      {
        "id": "s2",
        "text": "A value of 0 means the car travels east. A value of 1 means the car travels west."
      },
      {
        "id": "s3",
        "text": "Two cars pass when the eastbound car is west of the westbound car, that is, when it has the smaller index."
      },
      {
        "id": "s4",
        "text": "The function returns the number of passing pairs. If that number is greater than 1,000,000,000, the function returns -1."
      },
      {
        "id": "s5",
        "text": "For example, given A = [0, 1, 0, 1, 1], the pairs are (0,1), (0,3), (0,4), (2,3) and (2,4), so the function returns 5."
      }
    ],
    "example": "A[0] = 0\nA[1] = 1\nA[2] = 0\nA[3] = 1\nA[4] = 1\n\nthe function returns 5",
    "assumptions": [
      {
        "id": "a1",
        "text": "N is an integer within the range [1..100,000]."
      },
      {
        "id": "a2",
        "text": "Each element of array A is 0 or 1."
      },
      {
        "id": "a3",
        "text": "If the number of pairs is greater than 1,000,000,000, return -1."
      }
    ]
  },
  "window": {
    "title": "Shortest length whose sum reaches the goal",
    "sentences": [
      {
        "id": "s1",
        "text": "An array A of positive integers and a positive integer K are given."
      },
      {
        "id": "s2",
        "text": "Look only at contiguous slices of A. Among the slices whose sum is at least K, find one with the smallest length."
      },
      {
        "id": "s3",
        "text": "The function returns that length. If no contiguous slice sums to at least K, it returns 0."
      },
      {
        "id": "s4",
        "text": "For example, given A = [2, 3, 1, 2, 4, 3] and K = 7, the neighbouring values 4 and 3 have length 2 and sum 7. No shorter contiguous slice sums to at least 7, so the function returns 2."
      }
    ],
    "example": "K = 7\nA[0] = 2\nA[1] = 3\nA[2] = 1\nA[3] = 2\nA[4] = 4\nA[5] = 3\n\nthe function returns 2",
    "assumptions": [
      {
        "id": "a1",
        "text": "N, the length of A, is an integer within the range [1..100,000]."
      },
      {
        "id": "a2",
        "text": "Each element of A, and K, is an integer within the range [1..1,000,000,000]."
      },
      {
        "id": "a3",
        "text": "Only contiguous slices count. Do not add elements that are not neighbours in the slice."
      }
    ]
  },
  "set1-task1": {
    "title": "Word-boundary truncation of a push-notification preview",
    "sentences": [
      {
        "id": "s1",
        "text": "You are given a string message to display on a push-notification banner and the maximum number of characters K that can be displayed."
      },
      {
        "id": "s2",
        "text": "The function solution(message: String, K: Int) returns the notification-preview string."
      },
      {
        "id": "s3",
        "text": "message consists only of English letters and single half-width spaces; it has no leading or trailing spaces and no consecutive spaces."
      },
      {
        "id": "s4",
        "text": "If the length of the entire message is at most K characters, return message unchanged, without adding an ellipsis."
      },
      {
        "id": "s5",
        "text": "When the length of message exceeds K, do not cut in the middle of a word; choose some words from the beginning."
      },
      {
        "id": "s6",
        "text": "Append to the end of the chosen words one half-width space and three dots, \" ...\" (4 characters in total)."
      },
      {
        "id": "s7",
        "text": "The returned string has a total length of at most K characters and is the longest string of that form."
      },
      {
        "id": "s8",
        "text": "If even the first word, together with \" ...\", does not fit within K characters, or if K is less than 4, return only \"...\"."
      },
      {
        "id": "s9",
        "text": "However, if K is less than 3, return the empty string."
      },
      {
        "id": "s10",
        "text": "In example 1, when message is \"And now here is my secret\" and K is 15, return \"And now ...\" (11 characters)."
      },
      {
        "id": "s11",
        "text": "\"And now here ...\" is 16 characters, which exceeds 15, the value of K, so it is not allowed."
      },
      {
        "id": "s12",
        "text": "In example 2, when message is \"There is an animal with four legs\" and K is 15, return \"There is ...\" (12 characters)."
      },
      {
        "id": "s13",
        "text": "In example 3, when message is \"super dog\" and K is 4, return \"...\". \"super ...\" is 9 characters and does not fit."
      },
      {
        "id": "s14",
        "text": "In example 4, when message is \"how are you\" and K is 20, return \"how are you\" (11 characters) unchanged."
      }
    ],
    "example": "Example 1\n  message = \"And now here is my secret\"\n  K = 15\n  returns \"And now ...\"\n\nExample 2\n  message = \"There is an animal with four legs\"\n  K = 15\n  returns \"There is ...\"\n\nExample 3\n  message = \"super dog\"\n  K = 4\n  returns \"...\"\n\nExample 4\n  message = \"how are you\"\n  K = 20\n  returns \"how are you\"",
    "assumptions": [
      {
        "id": "a1",
        "text": "The length N of message is at least 1 and at most 500."
      },
      {
        "id": "a2",
        "text": "K is an integer at least 1 and at most 500."
      }
    ]
  },
  "set1-task2": {
    "title": "Spam burst detection in a chat stream",
    "sentences": [
      {
        "id": "s1",
        "text": "For N messages, you are given an array timestamps of send times, an array senderIds of sender IDs, and a time window windowMs."
      },
      {
        "id": "s2",
        "text": "The values in timestamps are relative times in milliseconds and are in ascending order."
      },
      {
        "id": "s3",
        "text": "Each value in senderIds is the positive integer ID of the sender who sent that message."
      },
      {
        "id": "s4",
        "text": "The range you look at is a contiguous interval [T, T+windowMs] that includes both endpoints."
      },
      {
        "id": "s5",
        "text": "A person who sent at least one message inside the interval is counted as one unique sender."
      },
      {
        "id": "s6",
        "text": "The function returns the maximum number of unique senders over any such interval."
      },
      {
        "id": "s7",
        "text": "In the example, when timestamps is [100, 200, 300, 350, 700, 800], senderIds is [1, 2, 1, 3, 2, 4], and windowMs is 250, it returns 3."
      },
      {
        "id": "s8",
        "text": "The interval [100, 350] has a width of at most 250, and the number of unique senders among [1, 2, 1, 3] is 3."
      },
      {
        "id": "s9",
        "text": "These 3 people are the maximum for this input."
      }
    ],
    "example": "timestamps = [100, 200, 300, 350, 700, 800]\nsenderIds = [1, 2, 1, 3, 2, 4]\nwindowMs = 250\nreturns 3",
    "assumptions": [
      {
        "id": "a1",
        "text": "N is at least 0 and at most 100000."
      },
      {
        "id": "a2",
        "text": "Each value in timestamps is at least 0 and at most 1000000000, and timestamps[i] is less than or equal to timestamps[i+1]."
      },
      {
        "id": "a3",
        "text": "Each value in senderIds is at least 1 and at most 100000."
      },
      {
        "id": "a4",
        "text": "windowMs is at least 0 and at most 1000000000."
      }
    ]
  },
  "set1-task3": {
    "title": "Batch-split upload of offline event logs",
    "sentences": [
      {
        "id": "s1",
        "text": "There are N action logs accumulated while offline, and the size of event i is payloadSizes[i] bytes."
      },
      {
        "id": "s2",
        "text": "While preserving the order of occurrence, split them into batches that are contiguous subarrays and send them in at most maxBatches HTTP requests."
      },
      {
        "id": "s3",
        "text": "The load score of a batch is the sum of the data sizes in the batch plus the product of headerOverhead and the number of events."
      },
      {
        "id": "s4",
        "text": "The score of an empty batch is 0."
      },
      {
        "id": "s5",
        "text": "When splitting into at most maxBatches batches, minimize the load of the largest batch."
      },
      {
        "id": "s6",
        "text": "The function returns the smallest achievable maximum batch load."
      },
      {
        "id": "s7",
        "text": "In the example, when maxBatches is 3, headerOverhead is 2, and payloadSizes is [4, 2, 7, 1, 5, 3], it returns 12."
      },
      {
        "id": "s8",
        "text": "The effective size of each event is its size plus 2, which is [6, 4, 9, 3, 7, 5]."
      },
      {
        "id": "s9",
        "text": "The loads of [6, 4], [9, 3], and [7, 5] are 10, 12, and 12, and the maximum cannot be made smaller than 12."
      }
    ],
    "example": "maxBatches = 3\nheaderOverhead = 2\npayloadSizes = [4, 2, 7, 1, 5, 3]\nreturns 12",
    "assumptions": [
      {
        "id": "a1",
        "text": "N is at least 1 and at most 100000."
      },
      {
        "id": "a2",
        "text": "maxBatches is at least 1 and at most N."
      },
      {
        "id": "a3",
        "text": "headerOverhead is at least 0 and at most 10000."
      },
      {
        "id": "a4",
        "text": "Each element of payloadSizes is at least 1 and at most 1000000000."
      },
      {
        "id": "a5",
        "text": "The return type is Long."
      }
    ]
  },
  "set2-task1": {
    "title": "Numeric stack undo and redo",
    "sentences": [
      {
        "id": "s1",
        "text": "A numeric stack machine executes the space-separated command string S in order from the beginning."
      },
      {
        "id": "s2",
        "text": "After every command has been executed, return the integer at the top of the stack."
      },
      {
        "id": "s3",
        "text": "If an error occurs partway through, or if the stack is empty at the end, return -1."
      },
      {
        "id": "s4",
        "text": "A non-negative integer from 0 through 1048575 pushes that integer onto the stack."
      },
      {
        "id": "s5",
        "text": "POP removes the top element. If the stack is empty, that is an error."
      },
      {
        "id": "s6",
        "text": "DUP duplicates the top element and pushes it. If the stack is empty, that is an error."
      },
      {
        "id": "s7",
        "text": "+ pops the top two elements and pushes their sum. It is an error if there are fewer than two elements, or if the sum exceeds 1048575."
      },
      {
        "id": "s8",
        "text": "- takes the top two elements and pushes the value of the top element minus the next element. It is an error if there are fewer than two elements, or if the result is negative."
      }
    ],
    "example": "Example 1: S=\"4 5 6 - 7 +\". 4→[4], 5→[4, 5], 6→[4, 5, 6], - is 6-5=1 giving [4, 1], 7→[4, 1, 7], + is 7+1=8 giving [4, 8]. The returned value is 8. Example 2: S=\"13 DUP 4 POP 5 DUP + DUP + -\" is 7. Example 3: S=\"5 6 + -\" is -1 because there is only one element. Example 4: S=\"3 DUP 5 - -\" is -1 because after 5-3=2, 2-3 is negative.",
    "assumptions": [
      {
        "id": "a1",
        "text": "The length of S is from 0 through 50000."
      },
      {
        "id": "a2",
        "text": "The required complexity is time O(N) and space O(N)."
      }
    ]
  },
  "set2-task2": {
    "title": "Peak bandwidth of simultaneous viewing",
    "sentences": [
      {
        "id": "s1",
        "text": "There are N viewing sessions, and session i lasts from startTimes[i] to endTimes[i]."
      },
      {
        "id": "s2",
        "text": "The start time and the end time form a closed interval that includes both endpoint times."
      },
      {
        "id": "s3",
        "text": "During that time, session i consumes a constant bandwidth of bandwidths[i] (Mbps)."
      },
      {
        "id": "s4",
        "text": "Return the maximum, over all time periods, of the sum of the bandwidths of sessions that are active at the same time."
      },
      {
        "id": "s5",
        "text": "A session that ends at time T and a session that starts at time T are both considered active at time T."
      }
    ],
    "example": "startTimes=[1, 2, 5], endTimes=[4, 6, 8], bandwidths=[10, 20, 15]. At time [2, 4], sessions 0 and 1 overlap and 10+20=30. At time [5, 6], sessions 1 and 2 overlap and 20+15=35. Return the maximum 35.",
    "assumptions": [
      {
        "id": "a1",
        "text": "N is an integer greater than or equal to 0 and less than or equal to 100000."
      },
      {
        "id": "a2",
        "text": "For each session, 0 <= startTimes[i] <= endTimes[i] <= 1000000000."
      },
      {
        "id": "a3",
        "text": "For each session, 1 <= bandwidths[i] <= 1000000000."
      },
      {
        "id": "a4",
        "text": "The required complexity is time O(N log N) and space O(N)."
      }
    ]
  },
  "set2-task3": {
    "title": "Maximum sum of a stamp part",
    "sentences": [
      {
        "id": "s1",
        "text": "canvas is a pixel canvas with H rows and W columns."
      },
      {
        "id": "s2",
        "text": "A cell where canvas[r][c] is 0 is a fully transparent pixel."
      },
      {
        "id": "s3",
        "text": "A cell where canvas[r][c] is greater than 0 is an opaque pixel with an opacity of at least 1 and at most 255."
      },
      {
        "id": "s4",
        "text": "When opaque pixels are adjacent in the four directions—up, down, left, and right—they belong to the same stamp part."
      },
      {
        "id": "s5",
        "text": "Diagonal directions are not considered adjacent."
      },
      {
        "id": "s6",
        "text": "Return the maximum among the sums of the opacities contained in a single part."
      },
      {
        "id": "s7",
        "text": "If there are no opaque pixels, return 0."
      }
    ],
    "example": "[0, 5, 10, 0] / [0, 5, 0, 8] / [0, 0, 0, 9]. The upper-left part is 5+10+5=20. The lower-right part is 8+9=17. Return the maximum value 20.",
    "assumptions": [
      {
        "id": "a1",
        "text": "H and W are at least 1, and H×W is at most 200000."
      },
      {
        "id": "a2",
        "text": "Each value in canvas is at least 0 and at most 255."
      },
      {
        "id": "a3",
        "text": "The required complexity is time O(H×W) and space O(H×W)."
      },
      {
        "id": "a4",
        "text": "A StackOverflowError caused by recursion must not occur."
      }
    ]
  },
  "set3-task1": {
    "title": "Forced app update check by semantic version",
    "sentences": [
      {
        "id": "s1",
        "text": "Compare the current client version clientVersion with the minimum required version minRequiredVersion."
      },
      {
        "id": "s2",
        "text": "A version is one or more non-negative integers separated by dots."
      },
      {
        "id": "s3",
        "text": "Return -1 if clientVersion is less than minRequiredVersion, 0 if they are equal, and 1 if clientVersion is greater."
      },
      {
        "id": "s4",
        "text": "Compare each segment as an integer, ignoring leading zeros. \"02\" and \"2\" are equal."
      },
      {
        "id": "s5",
        "text": "When the numbers of segments differ, treat missing trailing segments as 0. \"14.2\" and \"14.2.0.0\" are equal."
      },
      {
        "id": "s6",
        "text": "When clientVersion is \"14.2.9\" and minRequiredVersion is \"14.2.10\", return -1 because 9 is less than 10."
      },
      {
        "id": "s7",
        "text": "When clientVersion is \"14.02.0\" and minRequiredVersion is \"14.2\", return 0."
      },
      {
        "id": "s8",
        "text": "When clientVersion is \"15.0\" and minRequiredVersion is \"14.9.9\", return 1."
      }
    ],
    "example": "clientVersion = \"14.2.9\"\nminRequiredVersion = \"14.2.10\"\n\nreturns -1\n\nclientVersion = \"14.02.0\"\nminRequiredVersion = \"14.2\"\n\nreturns 0\n\nclientVersion = \"15.0\"\nminRequiredVersion = \"14.9.9\"\n\nreturns 1",
    "assumptions": [
      {
        "id": "a1",
        "text": "Each string has a length from 1 to 500, inclusive."
      },
      {
        "id": "a2",
        "text": "The numeric value of each segment is from 0 to 1,000,000,000, inclusive."
      }
    ]
  },
  "set3-task2": {
    "title": "Minimum strokes to draw a custom view list skyline",
    "sentences": [
      {
        "id": "s1",
        "text": "There are N bars arranged side by side, and the height of the i-th bar from the left is heights[i] pixels."
      },
      {
        "id": "s2",
        "text": "The entire bar graph is divided into a combination of non-overlapping rectangles."
      },
      {
        "id": "s3",
        "text": "The function returns the minimum number of rectangles required for that division."
      },
      {
        "id": "s4",
        "text": "When heights is [8, 8, 5, 7, 9, 8, 7, 4, 8], it returns 7."
      }
    ],
    "example": "heights[0] = 8\nheights[1] = 8\nheights[2] = 5\nheights[3] = 7\nheights[4] = 9\nheights[5] = 8\nheights[6] = 7\nheights[7] = 4\nheights[8] = 8\n\nreturns 7",
    "assumptions": [
      {
        "id": "a1",
        "text": "N is an integer greater than or equal to 1 and less than or equal to 100,000."
      },
      {
        "id": "a2",
        "text": "Each element of heights is an integer greater than or equal to 1 and less than or equal to 1,000,000,000."
      },
      {
        "id": "a3",
        "text": "Time is O(N), and the additional space is O(N)."
      }
    ]
  },
  "set3-task3": {
    "title": "Byte-limited LRU eviction in an image memory cache",
    "sentences": [
      {
        "id": "s1",
        "text": "You are given a maximum total capacity maxMemoryBytes, keys imageKeys in request order, and imageBytes, the number of bytes of each image."
      },
      {
        "id": "s2",
        "text": "The function returns the total number of cache hits."
      },
      {
        "id": "s3",
        "text": "If the key is already in the cache, increase the hit count by 1 and make that image the most recently accessed."
      },
      {
        "id": "s4",
        "text": "If the key is absent and that image's size exceeds maxMemoryBytes, skip it without storing it. This request is not a hit."
      },
      {
        "id": "s5",
        "text": "On a miss whose size is at most the maximum capacity, delete images in order from the least recently accessed until the total is at most the maximum capacity, then store the new image."
      },
      {
        "id": "s6",
        "text": "On a hit, do not replace the byte count. Update only recency."
      },
      {
        "id": "s7",
        "text": "The example is capacity 100, keys [1, 2, 3, 1, 4, 2], and sizes [40, 50, 30, 40, 60, 50]. In the booklet's trace, all six requests are misses, so the returned hit count is 0."
      }
    ],
    "example": "maxMemoryBytes = 100\nimageKeys = [1, 2, 3, 1, 4, 2]\nimageBytes = [40, 50, 30, 40, 60, 50]\n\nreturns 0",
    "assumptions": [
      {
        "id": "a1",
        "text": "The number of requests N is an integer from 0 to 100,000 inclusive."
      },
      {
        "id": "a2",
        "text": "maxMemoryBytes is from 1 to 1,000,000,000 inclusive."
      },
      {
        "id": "a3",
        "text": "The time is O(N), and the additional space is O(N)."
      }
    ]
  },
  "set4-task1": {
    "title": "Visible item count in a vertical scroll list",
    "sentences": [
      {
        "id": "s1",
        "text": "N items are arranged vertically with no gaps."
      },
      {
        "id": "s2",
        "text": "The height of the i-th item from the top (0 <= i < N) is itemHeights[i], a positive integer."
      },
      {
        "id": "s3",
        "text": "The Y coordinate of the top edge of the first item is 0."
      },
      {
        "id": "s4",
        "text": "The range occupied by item i is the half-open interval [Y_i, Y_i + itemHeights[i])."
      },
      {
        "id": "s5",
        "text": "Y_0 is 0, and Y_i is the sum of itemHeights from 0 inclusive to i exclusive."
      },
      {
        "id": "s6",
        "text": "There are M queries, and the viewport of query q is the half-open interval [viewportTop[q], viewportBottom[q])."
      },
      {
        "id": "s7",
        "text": "For each query, find the number of items that overlap the viewport by at least 1 pixel."
      },
      {
        "id": "s8",
        "text": "The return value is an array of length M containing those counts in query order."
      },
      {
        "id": "s9",
        "text": "The function is solution(itemHeights: IntArray, viewportTop: LongArray, viewportBottom: LongArray): IntArray."
      }
    ],
    "example": "itemHeights = [100, 200, 150, 300]. The ranges are item 0 [0, 100), item 1 [100, 300), item 2 [300, 450), and item 3 [450, 750). Query 0: top = 50, bottom = 350 → 3 (items 0, 1, 2). Query 1: top = 100, bottom = 300 → 1 (because the intervals are half-open, item 0 [0, 100) and item 2 [300, 450) do not overlap, and only item 1 does).",
    "assumptions": [
      {
        "id": "a1",
        "text": "N and M are integers from 1 to 100,000 inclusive."
      },
      {
        "id": "a2",
        "text": "itemHeights[i] is from 1 to 100,000 inclusive."
      },
      {
        "id": "a3",
        "text": "Each query satisfies 0 <= viewportTop[q] < viewportBottom[q] <= 10,000,000,000."
      },
      {
        "id": "a4",
        "text": "The required complexity is O(N) preprocessing, O(M log N) for answering the queries, and O(N) space."
      }
    ]
  },
  "set4-task2": {
    "title": "Deep-link URI query normalization",
    "sentences": [
      {
        "id": "s1",
        "text": "Build a normalized query string from the deep-link string uri."
      },
      {
        "id": "s2",
        "text": "uri has the form scheme://host/path?key=value&...#fragment, and the query or the fragment may be absent."
      },
      {
        "id": "s3",
        "text": "Remove the fragment after #, and use only the query between ? and #."
      },
      {
        "id": "s4",
        "text": "If there is no query, or the query is empty, return an empty string."
      },
      {
        "id": "s5",
        "text": "Parse each element separated by & as key=value."
      },
      {
        "id": "s6",
        "text": "Ignore empty elements, elements that do not contain =, and elements whose key is an empty string."
      },
      {
        "id": "s7",
        "text": "The form key= is valid even when value is an empty string."
      },
      {
        "id": "s8",
        "text": "Exclude every parameter whose key starts with utm_."
      },
      {
        "id": "s9",
        "text": "When the same key appears more than once, use the value that appears last."
      },
      {
        "id": "s10",
        "text": "Sort the remaining parameters by key in lexicographical order (ASCII ascending), join them as key=value with &, and return the result."
      }
    ],
    "example": "uri = \"line://shop/detail?id=42&utm_source= push&sort=desc&id=99&empty=#top\" → \"empty=&id=99&sort=desc\". Remove #top, exclude utm_source, use the last 99 for id, and the lexicographical key order is empty, id, sort.",
    "assumptions": [
      {
        "id": "a1",
        "text": "The length of uri is at least 1 and at most 10,000."
      },
      {
        "id": "a2",
        "text": "The required complexity is Time O(L log K). L is the string length, and K is the number of parameters."
      }
    ]
  },
  "set4-task3": {
    "title": "Initialization task dependencies and cycle detection",
    "sentences": [
      {
        "id": "s1",
        "text": "There are N initialization tasks, numbered from 0 to N-1."
      },
      {
        "id": "s2",
        "text": "prerequisite and dependent each have length M, and dependent[k] cannot start until prerequisite[k] has finished."
      },
      {
        "id": "s3",
        "text": "A dependency is a directed edge from prerequisite[k] to dependent[k]."
      },
      {
        "id": "s4",
        "text": "If there is a cycle and not every task can be completed, return an empty array."
      },
      {
        "id": "s5",
        "text": "If every task can be completed, return an execution order that satisfies the dependencies."
      },
      {
        "id": "s6",
        "text": "When several tasks can be executed at the same time, always execute the one with the smallest task number first."
      },
      {
        "id": "s7",
        "text": "That execution order is an array of length N."
      },
      {
        "id": "s8",
        "text": "The function is solution(N: Int, prerequisite: IntArray, dependent: IntArray): IntArray."
      }
    ],
    "example": "Example 1: N = 4, prerequisite = [1, 2, 0], dependent = [3, 0, 1]. The dependencies are 2 → 0 → 1 → 3, so [2, 0, 1, 3]. Example 2: N = 3, prerequisite = [0, 1, 2], dependent = [1, 2, 0]. There is a cycle 0 → 1 → 2 → 0, so an empty array.",
    "assumptions": [
      {
        "id": "a1",
        "text": "N is an integer from 1 to 100,000 inclusive."
      },
      {
        "id": "a2",
        "text": "M is an integer from 0 to 200,000 inclusive."
      },
      {
        "id": "a3",
        "text": "The required complexity is time O((N + M) log N) and space O(N + M)."
      },
      {
        "id": "a4",
        "text": "Do not cause a StackOverflowError from recursive DFS."
      }
    ]
  },
  "set5-task1": {
    "title": "Longest consecutive active days for a notification badge",
    "sentences": [
      {
        "id": "s1",
        "text": "Array A is the login status over the past N days, and each element is 0 or 1."
      },
      {
        "id": "s2",
        "text": "1 is a day the user logged in, and 0 is a day the user did not log in."
      },
      {
        "id": "s3",
        "text": "solution(A: IntArray): Int should return the longest number of consecutive days that are 1."
      },
      {
        "id": "s4",
        "text": "The function printed in the booklet has a bug and, for some inputs, does not return that number of days."
      },
      {
        "id": "s5",
        "text": "You may fix at most two lines of the existing code. Rewriting the entire function scores 0."
      },
      {
        "id": "s6",
        "text": "When A is [1, 0, 1, 1], the consecutive 1s have length 1 and length 2, so it returns 2."
      },
      {
        "id": "s7",
        "text": "When A is [1], that one day is consecutive, so it returns 1."
      }
    ],
    "example": "A[0] = 1\nA[1] = 0\nA[2] = 1\nA[3] = 1\n\nreturns 2",
    "assumptions": [
      {
        "id": "a1",
        "text": "N is an integer from 1 to 100,000 inclusive."
      },
      {
        "id": "a2",
        "text": "Each element of A is 0 or 1."
      },
      {
        "id": "a3",
        "text": "The target complexity is O(N) time and O(1) space."
      }
    ]
  },
  "set5-task2": {
    "title": "Per-channel notification cooldown",
    "sentences": [
      {
        "id": "s1",
        "text": "N notifications arrive at channel C[i] at time T[i] seconds. T is non-decreasing."
      },
      {
        "id": "s2",
        "text": "The cooldown time is D seconds."
      },
      {
        "id": "s3",
        "text": "Delivery succeeds if the notification is the first one on that channel, or if the current time minus the previous successful delivery time is greater than or equal to D."
      },
      {
        "id": "s4",
        "text": "If the difference is less than D, the notification is suppressed. A suppressed notification does not update the previous successful delivery time."
      },
      {
        "id": "s5",
        "text": "Return the total number of notifications that were successfully delivered."
      },
      {
        "id": "s6",
        "text": "When T is [1, 3, 6, 10, 11], C is [10, 10, 10, 20, 20], and D is 5, return 3."
      },
      {
        "id": "s7",
        "text": "In this example, times 1, 6, and 10 are successful deliveries, and times 3 and 11 are suppressed."
      }
    ],
    "example": "T[0] = 1\nT[1] = 3\nT[2] = 6\nT[3] = 10\nT[4] = 11\nC[0] = 10\nC[1] = 10\nC[2] = 10\nC[3] = 20\nC[4] = 20\nD = 5\n\nreturns 3",
    "assumptions": [
      {
        "id": "a1",
        "text": "N is an integer greater than or equal to 0 and less than or equal to 100,000."
      },
      {
        "id": "a2",
        "text": "T[i] is greater than or equal to 0 and less than or equal to 1,000,000,000, and the values are in non-decreasing order."
      },
      {
        "id": "a3",
        "text": "C[i] is greater than or equal to 1 and less than or equal to 1,000,000,000."
      },
      {
        "id": "a4",
        "text": "D is greater than or equal to 1 and less than or equal to 1,000,000,000."
      }
    ]
  },
  "set5-task3": {
    "title": "Minimum bandwidth for a split offline article-pack download",
    "sentences": [
      {
        "id": "s1",
        "text": "The N chunks are arranged in the order of array S, and the unit of size is KB. The order cannot be rearranged."
      },
      {
        "id": "s2",
        "text": "Split them into at most K batches. One batch is one or more consecutive chunks."
      },
      {
        "id": "s3",
        "text": "Return the maximum of the block totals when that maximum has been made as small as possible."
      },
      {
        "id": "s4",
        "text": "The return value is a Long. The sum of S may exceed the maximum value of an Int."
      },
      {
        "id": "s5",
        "text": "When K is 3 and S is [200, 100, 500, 100, 200, 200, 200], return 600."
      },
      {
        "id": "s6",
        "text": "The totals of [200, 100], [500, 100], and [200, 200, 200] are 300, 600, and 600, and the maximum is 600."
      },
      {
        "id": "s7",
        "text": "With other splits, the maximum becomes 700 or 800, which is larger than 600."
      }
    ],
    "example": "K = 3\nS[0] = 200\nS[1] = 100\nS[2] = 500\nS[3] = 100\nS[4] = 200\nS[5] = 200\nS[6] = 200\n\nreturns 600",
    "assumptions": [
      {
        "id": "a1",
        "text": "N is an integer from 1 to 100,000 inclusive."
      },
      {
        "id": "a2",
        "text": "K is an integer from 1 to N inclusive."
      },
      {
        "id": "a3",
        "text": "S[i] is an integer from 1 to 100,000,000 inclusive."
      },
      {
        "id": "a4",
        "text": "The target complexity is time O(N log(sum)) and space O(1)."
      }
    ]
  },
  "set5-task4": {
    "title": "Article search and in-memory cache control",
    "sentences": [
      {
        "id": "s1",
        "text": "The class to implement is ArticleSearchViewModel."
      },
      {
        "id": "s2",
        "text": "The initial value of uiState is SearchUiState.Idle."
      },
      {
        "id": "s3",
        "text": "onQuerySubmitted trims whitespace from both ends of rawQuery."
      },
      {
        "id": "s4",
        "text": "If the text after trim is shorter than 2 characters, do not call the repository, cancel the search if one is in progress, and set the state to SearchUiState.Error(trimmedQuery, \"Query too short\")."
      },
      {
        "id": "s5",
        "text": "When rawQuery is \" a \", the text after trim is the 1 character \"a\", so the state becomes Error(\"a\", \"Query too short\")."
      },
      {
        "id": "s6",
        "text": "If a successful result is cached and forceRefresh is false, do not emit Loading and do not call the repository; immediately emit Content(trimmedQuery, cachedList, fromCache = true)."
      },
      {
        "id": "s7",
        "text": "If that cache has 0 items, emit SearchUiState.Empty(trimmedQuery) instead of Content."
      },
      {
        "id": "s8",
        "text": "On a cache miss, or when forceRefresh is true, cancel the old search and, after Loading, call repository.searchArticles(trimmedQuery)."
      },
      {
        "id": "s9",
        "text": "If the result is empty, emit Empty(trimmedQuery); if there is 1 or more items, emit Content(trimmedQuery, list, fromCache = false), and cache that result."
      },
      {
        "id": "s10",
        "text": "Rethrow CancellationException. Any other exception is Error(trimmedQuery, \"Network error\" if e.message is absent)."
      },
      {
        "id": "s11",
        "text": "clearCache deletes the entire cache and returns the state to SearchUiState.Idle."
      },
      {
        "id": "s12",
        "text": "This runner cannot execute a class."
      }
    ],
    "example": "rawQuery = \" a \"\nafter trim = \"a\"\n\nstate is Error(\"a\", \"Query too short\")\nrepository is not called",
    "assumptions": [
      {
        "id": "a1",
        "text": "The default value of forceRefresh on onQuerySubmitted is false."
      },
      {
        "id": "a2",
        "text": "The cache is in memory and is kept until clearCache."
      }
    ]
  },
  "set5-task5": {
    "title": "Authentication and rate-limit retry interceptor",
    "sentences": [
      {
        "id": "s1",
        "text": "The class to implement is ResilientAuthInterceptor, an OkHttp Interceptor."
      },
      {
        "id": "s2",
        "text": "When getCurrentToken() is neither null nor an empty string, attach Authorization: Bearer <token>. If a header with the same name already exists, overwrite it."
      },
      {
        "id": "s3",
        "text": "If the first response is 401, call refreshToken()."
      },
      {
        "id": "s4",
        "text": "If the new token is neither null nor an empty string, close() the first response, then call chain.proceed exactly once with Authorization: Bearer <newToken>, and return that result."
      },
      {
        "id": "s5",
        "text": "When refreshToken() is null or an empty string, or when the response is still 401 after the retry, call onSessionExpired() once and return that response as is."
      },
      {
        "id": "s6",
        "text": "If the first response is 503, close() the first response, then retry the same request exactly once with chain.proceed, and return that result."
      },
      {
        "id": "s7",
        "text": "This runner cannot execute the class."
      }
    ],
    "example": "first response code = 503\n\nclose the first response\nretry the same request exactly once and return that result",
    "assumptions": [
      {
        "id": "a1",
        "text": "AuthSessionManager has getCurrentToken, refreshToken, and onSessionExpired."
      },
      {
        "id": "a2",
        "text": "The 401 re-request and the 503 retry are each limited to one time."
      }
    ]
  },
  "area1": {
    "title": "Minimum impact in a string range",
    "sentences": [
      {
        "id": "s1",
        "text": "Each character of string S has an impact. A is 1, C is 2, G is 3, and anything else, including T, is 4."
      },
      {
        "id": "s2",
        "text": "The k-th range runs from position P[k] to position Q[k] and includes the characters at both ends."
      },
      {
        "id": "s3",
        "text": "The function finds the minimum impact inside each range and returns those values in order, one for each range."
      },
      {
        "id": "s4",
        "text": "If S is empty, or there are zero ranges, return an empty array."
      },
      {
        "id": "s5",
        "text": "When S is CAGCCTA, P is [2, 5, 0], and Q is [4, 5, 6], the returned array is [2, 4, 1]."
      },
      {
        "id": "s6",
        "text": "Positions 2 through 4 are G, C, C, so the minimum is 2. Position 5 alone is T, so it is 4. Positions 0 through 6 contain A, so it is 1."
      }
    ],
    "example": "S = CAGCCTA\nP = [2, 5, 0]\nQ = [4, 5, 6]\n\nreturns [2, 4, 1]",
    "assumptions": [
      {
        "id": "a1",
        "text": "In the example, the length of S is 7 and there are 3 ranges."
      }
    ]
  },
  "area2": {
    "title": "Fish remaining after opposite directions meet",
    "sentences": [
      {
        "id": "s1",
        "text": "The fish are lined up from the smaller numbers. A[i] is the size, and B[i] is the direction."
      },
      {
        "id": "s2",
        "text": "If B[i] is 0, the fish swims toward the smaller numbers; if it is 1, the fish swims toward the larger numbers."
      },
      {
        "id": "s3",
        "text": "Fish swimming in the same direction do not meet. Only a fish swimming toward the larger numbers and a fish swimming toward the smaller numbers from its right meet."
      },
      {
        "id": "s4",
        "text": "When they meet, the larger one remains. If their sizes are the same, the fish swimming toward the smaller numbers remains."
      },
      {
        "id": "s5",
        "text": "The function returns the number of fish that remain at the end. If there are 0 or 1 fish, it returns that number."
      },
      {
        "id": "s6",
        "text": "When A is [4, 3, 2, 1, 5] and B is [0, 1, 0, 0, 0], it returns 2."
      }
    ],
    "example": "A = [4, 3, 2, 1, 5]\nB = [0, 1, 0, 0, 0]\n\nreturns 2",
    "assumptions": [
      {
        "id": "a1",
        "text": "In the example, there are 5 fish."
      }
    ]
  },
  "area3": {
    "title": "Maximum sum of a contiguous part",
    "sentences": [
      {
        "id": "s1",
        "text": "Consider the sum of a non-empty contiguous part of array A."
      },
      {
        "id": "s2",
        "text": "The function returns the largest of those sums."
      },
      {
        "id": "s3",
        "text": "If A is empty, return 0. If it has one element, return that value."
      },
      {
        "id": "s4",
        "text": "Even if every element is negative, do not return 0. Return the largest element among them."
      },
      {
        "id": "s5",
        "text": "When A is [3, 2, -6, 4, 0], the sum of 3 and 2 is 5, which is the maximum, so return 5."
      }
    ],
    "example": "A = [3, 2, -6, 4, 0]\n\nreturns 5",
    "assumptions": [
      {
        "id": "a1",
        "text": "The example array has 5 elements."
      }
    ]
  },
  "area4": {
    "title": "Minimize the largest sum of at most K contiguous segments",
    "sentences": [
      {
        "id": "s1",
        "text": "Divide array A into contiguous segments that keep the original order. The number of segments is at most K."
      },
      {
        "id": "s2",
        "text": "Look at the sum of the elements in each segment. Choose a division that makes the largest of those sums as small as possible."
      },
      {
        "id": "s3",
        "text": "The function returns that largest segment sum after it has been made as small as possible."
      },
      {
        "id": "s4",
        "text": "If A is empty, return 0. If K is at least the number of elements, return the largest element. If K is 1, return the sum of all elements."
      },
      {
        "id": "s5",
        "text": "The second argument M is received but is not used in the calculation in this file. The upper limit on the number of segments is K."
      },
      {
        "id": "s6",
        "text": "When K is 3, M is 5, and A is [2, 1, 5, 1, 2, 2, 2], return 6. The sums of [2, 1], [5, 1], and [2, 2, 2] are 3, 6, and 6."
      }
    ],
    "example": "K = 3\nM = 5\nA = [2, 1, 5, 1, 2, 2, 2]\n\nreturns 6",
    "assumptions": [
      {
        "id": "a1",
        "text": "In the example, K is 3, M is 5, and A has 7 elements."
      }
    ]
  },
  "area5": {
    "title": "Number of overlapping disc pairs",
    "sentences": [
      {
        "id": "s1",
        "text": "Discs lie on a number line. The i-th disc is centered at position i, and its radius is A[i]."
      },
      {
        "id": "s2",
        "text": "Count both pairs that overlap and pairs that only touch at an edge."
      },
      {
        "id": "s3",
        "text": "The function returns the number of such pairs. If there are fewer than 2 discs, return 0."
      },
      {
        "id": "s4",
        "text": "If the number of pairs exceeds 10,000,000, return -1."
      },
      {
        "id": "s5",
        "text": "When A is [1, 5, 2, 1, 4, 0], return 11."
      }
    ],
    "example": "A = [1, 5, 2, 1, 4, 0]\n\nreturns 11",
    "assumptions": [
      {
        "id": "a1",
        "text": "The example has 6 discs. If the number of pairs exceeds 10,000,000, the result is -1."
      }
    ]
  },
  "area6": {
    "title": "Number of groups linked by lines",
    "sentences": [
      {
        "id": "s1",
        "text": "There are N points, numbered from 0 to N-1. U[i] and V[i] are one line that connects both ways."
      },
      {
        "id": "s2",
        "text": "Points that can reach one another by following lines form one group. A point with no line is one group by itself."
      },
      {
        "id": "s3",
        "text": "The function returns the number of groups."
      },
      {
        "id": "s4",
        "text": "If N is 0 or less, return 0. If there are no lines, return N."
      },
      {
        "id": "s5",
        "text": "When N is 5, U is [0, 1, 3], and V is [1, 2, 4], the groups are 0-1-2 and 3-4, so return 2."
      }
    ],
    "example": "N = 5\nU = [0, 1, 3]\nV = [1, 2, 4]\n\nreturns 2",
    "assumptions": [
      {
        "id": "a1",
        "text": "The example has 5 points and 3 lines."
      }
    ]
  },
  "area7": {
    "title": "Call-log charges; the longest number is free",
    "sentences": [
      {
        "id": "s1",
        "text": "S is a call log, and each line is “hour:minute:second,phone number”."
      },
      {
        "id": "s2",
        "text": "If a call is shorter than 300 seconds, the charge is the number of seconds multiplied by 3. If it is 300 seconds or longer, the charge is the number of minutes, after rounding the seconds up in units of 60 seconds, multiplied by 150."
      },
      {
        "id": "s3",
        "text": "Seconds and charges for the same number are combined using the numeric value of the number with hyphens removed. Unreadable lines are ignored."
      },
      {
        "id": "s4",
        "text": "The charge for the number with the greatest total seconds is set to 0. If the seconds are the same, the number with the smaller numeric value is set to 0."
      },
      {
        "id": "s5",
        "text": "The function returns the sum of the charges for the other numbers. If it is empty, or there are no readable lines, the result is 0."
      },
      {
        "id": "s6",
        "text": "In the example’s 3 lines, 400-234-090 is 67 seconds and 300 seconds, for a total of 367 seconds, and 701-080-080 is 301 seconds. The longer one is free; 301 seconds rounds up to 6 minutes, and 6 multiplied by 150, which is 900, is returned."
      }
    ],
    "example": "00:01:07,400-234-090\n00:05:01,701-080-080\n00:05:00,400-234-090\n\nreturns 900",
    "assumptions": [
      {
        "id": "a1",
        "text": "Under 300 seconds the rate is 3 per second, and at 300 seconds or more it is 150 per rounded-up minute. The example log has 3 lines."
      }
    ]
  },
  "area8": {
    "title": "Length of the longest contiguous part without a repeated character",
    "sentences": [
      {
        "id": "s1",
        "text": "Consider a contiguous part of the string S in which the same character does not appear twice."
      },
      {
        "id": "s2",
        "text": "The function returns the maximum of those lengths."
      },
      {
        "id": "s3",
        "text": "If the length of S is 0, return 0; if it is 1, return 1."
      },
      {
        "id": "s4",
        "text": "When S is abcabcbb, the length 3 of abc is the longest, so return 3."
      }
    ],
    "example": "S = abcabcbb\n\nreturns 3",
    "assumptions": [
      {
        "id": "a1",
        "text": "The length of the example string is 8."
      }
    ]
  },
  "area9a": {
    "title": "Maximum number of segments that do not touch",
    "sentences": [
      {
        "id": "s1",
        "text": "The i-th segment runs from the start A[i] to the end B[i]. Both endpoints are included."
      },
      {
        "id": "s2",
        "text": "Segments chosen at the same time must not share any point. Even if they only touch at the same endpoint, they cannot be chosen together."
      },
      {
        "id": "s3",
        "text": "The function returns the maximum number of segments that can be chosen. If there is at most one segment, it returns that number."
      },
      {
        "id": "s4",
        "text": "When A is [1, 3, 7, 9, 9] and B is [5, 6, 8, 9, 10], it returns 3."
      }
    ],
    "example": "A = [1, 3, 7, 9, 9]\nB = [5, 6, 8, 9, 10]\n\nreturns 3",
    "assumptions": [
      {
        "id": "a1",
        "text": "The endpoints B are arranged in ascending order. The example has 5 segments."
      }
    ]
  },
  "area9b": {
    "title": "How many ropes of length at least K from tying neighbors",
    "sentences": [
      {
        "id": "s1",
        "text": "A[i] is the length of a rope laid out from left to right. Do not change the order. Tie only neighboring ropes."
      },
      {
        "id": "s2",
        "text": "Add the lengths from the left. When the total becomes K or more, count one finished rope, reset the total to 0, and keep adding what follows."
      },
      {
        "id": "s3",
        "text": "The function returns the number of finished ropes. If A is empty, or K is 0 or less, return 0."
      },
      {
        "id": "s4",
        "text": "When K is 4 and A is [1, 2, 3, 4, 1, 1, 3], the groups 1+2+3, then 4, then 1+1+3 make 3 ropes, so return 3."
      }
    ],
    "example": "K = 4\nA = [1, 2, 3, 4, 1, 1, 3]\n\nreturns 3",
    "assumptions": [
      {
        "id": "a1",
        "text": "In the example, K is 4 and there are 7 ropes."
      }
    ]
  },
  "area10": {
    "title": "Number of regions of equal numbers joined up, down, left, and right",
    "sentences": [
      {
        "id": "s1",
        "text": "Each cell of the grid contains an integer. Cells that are next to each other up, down, left, or right and contain the same integer belong to the same region."
      },
      {
        "id": "s2",
        "text": "Cells that are next to each other only diagonally do not belong to the same region."
      },
      {
        "id": "s3",
        "text": "The function returns the number of regions. If there are no rows, or the width is 0, it returns 0."
      },
      {
        "id": "s4",
        "text": "For the example with 7 rows and 3 columns, it returns 11."
      }
    ],
    "example": "5 4 4\n4 3 4\n3 2 4\n2 2 2\n3 3 4\n1 4 4\n4 1 1\n\nreturns 11",
    "assumptions": [
      {
        "id": "a1",
        "text": "The example grid has 7 rows and 3 columns."
      }
    ]
  },
  "area11": {
    "title": "Whether the same user's recent requests exceeded the limit",
    "sentences": [
      {
        "id": "s1",
        "text": "Requests are ordered by time. timestamps[i] is that time, and userIds[i] is the user."
      },
      {
        "id": "s2",
        "text": "For the same user, count only requests whose time is greater than the current time now minus windowSeconds. Older requests at or below that value are excluded."
      },
      {
        "id": "s3",
        "text": "If there are already maxRequests requests, this request is 0 and is not added to the count. If there are fewer, it is 1 and is added to the count."
      },
      {
        "id": "s4",
        "text": "The function returns the 0 or 1 for each request, in order. If there are zero requests, an empty array. If maxRequests is 0 or less, every value is 0."
      },
      {
        "id": "s5",
        "text": "When the times are [1, 2, 3, 8, 12], every user is 10, windowSeconds is 10, and maxRequests is 2, it returns [1, 1, 0, 0, 1]."
      },
      {
        "id": "s6",
        "text": "At times 3 and 8, the two requests at times 1 and 2 are still remaining, so the result is 0. At time 12, requests at or below 2, which is 12 minus 10, are excluded, leaving 0 requests, so the result is 1."
      }
    ],
    "example": "timestamps = [1, 2, 3, 8, 12]\nuserIds = [10, 10, 10, 10, 10]\nwindowSeconds = 10\nmaxRequests = 2\n\nreturns [1, 1, 0, 0, 1]",
    "assumptions": [
      {
        "id": "a1",
        "text": "In the example, windowSeconds is 10, maxRequests is 2, and there are 5 requests."
      }
    ]
  },
  "area12a": {
    "title": "How many positive divisors",
    "sentences": [
      {
        "id": "s1",
        "text": "The function returns how many positive integers divide the positive integer N."
      },
      {
        "id": "s2",
        "text": "If N is less than or equal to 0, return 0. If N is 1, return 1."
      },
      {
        "id": "s3",
        "text": "The positive integers that divide 24 are 1, 2, 3, 4, 6, 8, 12, and 24, which is 8 numbers, so return 8."
      }
    ],
    "example": "N = 24\n\nreturns 8",
    "assumptions": [
      {
        "id": "a1",
        "text": "In the example, N is 24."
      }
    ]
  },
  "area12b": {
    "title": "Chocolates eaten at a fixed step around a circle",
    "sentences": [
      {
        "id": "s1",
        "text": "The chocolates are arranged in a circle, numbered from 0 through N-1."
      },
      {
        "id": "s2",
        "text": "Eat the one at 0, then move M places ahead and eat again. Stop when you return to a place you have already eaten."
      },
      {
        "id": "s3",
        "text": "The function returns how many were eaten. If N or M is less than or equal to 0, return 0."
      },
      {
        "id": "s4",
        "text": "When N is 10 and M is 4, you eat the five places 0, 4, 8, 2, and 6, so return 5."
      }
    ],
    "example": "N = 10\nM = 4\n\nreturns 5",
    "assumptions": [
      {
        "id": "a1",
        "text": "In the example, N is 10 and M is 4."
      }
    ]
  },
  "bug1": {
    "title": "Return the first value when each value appears once",
    "sentences": [
      {
        "id": "s1",
        "text": "Count how many times each value in array A appears, and update the position of the value that has appeared more often."
      },
      {
        "id": "s2",
        "text": "When no value appears two or more times, that position is never updated."
      },
      {
        "id": "s3",
        "text": "If the position stays at its initial value of -1, reading outside the array fails. The value that should be returned is the first value."
      },
      {
        "id": "s4",
        "text": "When M is 3 and A is [1, 2, 3], the return value after the fix is 1."
      }
    ],
    "example": "M = 3\nA = [1, 2, 3]\n\nreturns 1",
    "assumptions": [
      {
        "id": "a1",
        "text": "In the example, A has 3 elements, each value appears once, and M is 3."
      }
    ]
  },
  "bug2": {
    "title": "Position of a value in an ascending sequence",
    "sentences": [
      {
        "id": "s1",
        "text": "A is in ascending order. The function returns the position of an element equal to X. If there is none, it returns -1. If A is empty, it returns -1."
      },
      {
        "id": "s2",
        "text": "If the middle of the search range is truncated and the left end is moved there, the left end does not advance when the range has 2 elements, and the search may not finish."
      },
      {
        "id": "s3",
        "text": "If the middle is shifted toward the upper side, the left end also advances when the range has 2 elements."
      },
      {
        "id": "s4",
        "text": "When A is [1, 2, 5, 9, 9] and X is 5, it returns position 2."
      }
    ],
    "example": "A = [1, 2, 5, 9, 9]\nX = 5\n\nreturns 2",
    "assumptions": [
      {
        "id": "a1",
        "text": "In the example, A has 5 elements and is in ascending order."
      }
    ]
  },
  "bug3": {
    "title": "Lined up from 1 to K with no neighbor jumps",
    "sentences": [
      {
        "id": "s1",
        "text": "For adjacent elements, if the next is greater than the previous by 2 or more, return false at that point."
      },
      {
        "id": "s2",
        "text": "After the fix, return true only when the first element is 1 and the last element is K. If either one differs, the result is false."
      },
      {
        "id": "s3",
        "text": "The buggy return sets false only when the first element is not 1 and the last element is not K, and sets true otherwise."
      },
      {
        "id": "s4",
        "text": "When A is [1, 1, 2, 3, 3] and K is 3, the first element is 1, the last element is 3, and there is no jump between neighbors, so it returns true."
      }
    ],
    "example": "A = [1, 1, 2, 3, 3]\nK = 3\n\nreturns true",
    "assumptions": [
      {
        "id": "a1",
        "text": "In the example, A has 5 elements and K is 3."
      }
    ]
  },
  "bug4": {
    "title": "Maximum adjacent matches after flipping one coin",
    "sentences": [
      {
        "id": "s1",
        "text": "A[i] is the face of a coin. If two adjacent coins show the same face, that is one match."
      },
      {
        "id": "s2",
        "text": "When there are two or more elements, return the maximum number of matches after flipping exactly one coin. If there is one element or fewer, return 0."
      },
      {
        "id": "s3",
        "text": "When every face is the same, flipping one coin at an end decreases the number of matches by 1. If the initial value of the change is left at 0, the option that does not decrease the count is chosen. Include cases that decrease the count as candidates as well."
      },
      {
        "id": "s4",
        "text": "When A is [1, 1, 1], the number of matches before flipping is 2. Flipping an end coin makes it 1, so return 1."
      }
    ],
    "example": "A = [1, 1, 1]\n\nreturns 1",
    "assumptions": [
      {
        "id": "a1",
        "text": "The example has 3 coins, and every face is 1."
      }
    ]
  },
  "area14": {
    "title": "Change the screen state by search-term length and saved results",
    "sentences": [
      {
        "id": "s1",
        "text": "Remove whitespace from both ends of the search term. If the length is less than 2, the state st returns to Idle."
      },
      {
        "id": "s2",
        "text": "The state is split by kind, and only st can be read from the outside. st cannot be assigned from the outside."
      },
      {
        "id": "s3",
        "text": "If the result for the same term is already saved, do not enter a loading state. If it is empty, use Empty; if there is a result, use Content, and mark it as saved."
      },
      {
        "id": "s4",
        "text": "If it is not saved, search after Loading. Copy the list to be saved. If it is empty, use Empty; if there is a result, use Content, and mark it as not saved."
      },
      {
        "id": "s5",
        "text": "If the search fails, the state is Error. Do not turn a cancellation exception into Error; throw it as is."
      },
      {
        "id": "s6",
        "text": "When the saved data is cleared, st returns to Idle."
      },
      {
        "id": "s7",
        "text": "Input that is only whitespace is Idle. The first Coroutines run is Content that is not saved, and the second time for the same term is Content that is saved."
      },
      {
        "id": "s8",
        "text": "This runner cannot run a class. Open the portal code and read it."
      }
    ],
    "example": "The initial state is Idle\nIf the input is only whitespace, Idle\nThe first Coroutines run is Content that is not saved\nThe second time for the same term is Content that is saved",
    "assumptions": [
      {
        "id": "a1",
        "text": "The minimum length of the search term is 2."
      }
    ]
  },
  "area15": {
    "title": "Resend when authentication is denied, and whether input can be submitted",
    "sentences": [
      {
        "id": "s1",
        "text": "If the response status is not 401, return that response as it is."
      },
      {
        "id": "s2",
        "text": "When it is 401, obtain a new token and resend only once. Before resending, close the 401 response."
      },
      {
        "id": "s3",
        "text": "If the newly obtained token is empty, report that the session has expired and return the first response."
      },
      {
        "id": "s4",
        "text": "An email has exactly one @, and that @ is not at the start; there is a dot after the @, and that dot is not at the edge of the domain."
      },
      {
        "id": "s5",
        "text": "A password has a length of 8 or more and contains at least one uppercase letter and at least one digit. You can submit only when both the email and the password are satisfied. At first, you cannot submit."
      },
      {
        "id": "s6",
        "text": "When the email is dev@example.com and the password is Pass1234, you can submit."
      },
      {
        "id": "s7",
        "text": "This runner cannot run a class. Open the portal code and read it."
      }
    ],
    "example": "Cannot submit at first\ndev@example.com and Pass1234 can be submitted",
    "assumptions": [
      {
        "id": "a1",
        "text": "The denial status is 401, and the minimum password length is 8 characters."
      }
    ]
  },
  "area16a": {
    "title": "Can you finish every task that must follow another",
    "sentences": [
      {
        "id": "s1",
        "text": "There are N tasks, numbered from 0 to N-1."
      },
      {
        "id": "s2",
        "text": "prereq[k] must be finished before target[k]."
      },
      {
        "id": "s3",
        "text": "Return true if all N tasks can be finished in this order. Return false if the tasks that must be finished first form a cycle, so none of them can be started."
      },
      {
        "id": "s4",
        "text": "Return true if there is one task or fewer, or if the ordering constraints are empty."
      },
      {
        "id": "s5",
        "text": "When N is 4, prereq is [0, 1, 2], and target is [1, 2, 3], 1 comes after 0, then 2, then 3, so the result is true."
      },
      {
        "id": "s6",
        "text": "If N is 2, and 1 comes after 0 and 0 comes after 1, they form a cycle, so the result is false."
      }
    ],
    "example": "N = 4\nprereq = [0, 1, 2]\ntarget = [1, 2, 3]\n\nreturns true",
    "assumptions": [
      {
        "id": "a1",
        "text": "The example has 4 tasks and 3 ordering constraints."
      }
    ]
  },
  "area16b": {
    "title": "Count of stacked heights overlapping the visible range",
    "sentences": [
      {
        "id": "s1",
        "text": "Items are stacked in order from the top. The i-th height is H[i]. The range an item occupies includes the sum of the heights up to that point and does not include the position after its own height is added."
      },
      {
        "id": "s2",
        "text": "The visible range also includes topY and does not include bottomY. Return the number of items that overlap it by any amount."
      },
      {
        "id": "s3",
        "text": "If there are 0 items, or if bottomY is less than or equal to topY, return 0."
      },
      {
        "id": "s4",
        "text": "When the heights are [50, 100, 80, 120, 60], the ranges are [0, 50), [50, 150), [150, 230), [230, 350), and [350, 410)."
      },
      {
        "id": "s5",
        "text": "When topY is 50 and bottomY is 230, only [50, 150) and [150, 230) overlap, so return 2. An item that ends at 50 and an item that starts at 230 do not overlap."
      }
    ],
    "example": "H = [50, 100, 80, 120, 60]\ntopY = 50\nbottomY = 230\n\nreturns 2",
    "assumptions": [
      {
        "id": "a1",
        "text": "The example has 5 items, topY is 50, and bottomY is 230."
      }
    ]
  }
};
