export const inputRules = [
    {
      operationType: "AccessingData",
      operationName: "var",
      examples: [
        {
          formula: {
            var: ["a"],
          },
          data: {
            a: 1,
            b: 2,
          },
          output: 1,
          info: "Retrieve data from the provided data object",
          description: "What is the value of variable a?",
        },
        {
          formula: {
            var: ["z", 26],
          },
          data: {
            a: 1,
            b: 2,
          },
          output: 26,
          info: "You can supply a default, as the second argument, for values that might be missing in the data object",
          description: "Value of variable z is 26",
        },
        {
          formula: {
            var: "champ.name",
          },
          data: {
            champ: {
              name: "Fezzig",
              height: 223,
            },
            challenger: {
              name: "Dread Pirate Roberts",
              height: 183,
            },
          },
          output: "Fezzig",
          info: "The key passed to var can use dot-notation to get the property of a property (to any depth you need):",
          description: "Retrieve the value of champ name",
        },
        {
          formula: {
            var: 1,
          },
          data: ["zero", "one", "two"],
          output: "one",
          info: "You can also use the var operator to access an array by numeric index:",
          description:
            "What is the value of the 1st index in the given data array?",
        },
        {
          formula: {
            and: [
              {
                "<": [
                  {
                    var: "temp",
                  },
                  110,
                ],
              },
              {
                "==": [
                  {
                    var: "pie.filling",
                  },
                  "apple",
                ],
              },
            ],
          },
          data: {
            temp: 100,
            pie: {
              filling: "apple",
            },
          },
          output: true,
          info: "Here’s a complex rule that mixes literals and data. The pie isn’t ready to eat unless it’s cooler than 110 degrees, and filled with apples.",
          description:
            "Check if temperature is below 110 and the pie is filled with apples.",
        },
        {
          formula: { cat: ["Hello, ", { var: "" }] },
          data: {data: "Dolly"},
          output: "Hello, Dolly",
          info: "You can also use var with an empty string to get the entire data object – which is really useful in map, filter, and reduce rules.",
          description: "Concatenate 'Hello, ' with the provided data.",
        },
      ],
    },
    {
      operationType: "AccessingData",
      operationName: "missing",
      examples: [
        {
          formula: { missing: ["a", "b"] },
          data: { a: "apple", c: "carrot" },
          output: ["b"],
          info: "Takes an array of data keys to search for (same format as var). Returns an array of any keys that are missing from the data object, or an empty array.",
          description: "Check for missing keys a and b.",
        },
        {
          formula: { missing: ["a", "b"] },
          data: { a: "apple", b: "banana" },
          output: [],
          info: "Takes an array of data keys to search for (same format as var). Returns an array of any keys that are missing from the data object, or an empty array.",
          description: "Check for missing keys a and b.",
        },
        {
          formula: {
            if: [{ missing: ["a", "b"] }, "Not enough fruit", "OK to proceed"],
          },
          data: { a: "apple", b: "banana" },
          output: "OK to proceed",
          info: "in JsonLogic, empty arrays are falsy. So you can use missing with if like:",
          description:
            "If either a or b is missing, output 'Not enough fruit', else 'OK to proceed'.",
        },
      ],
    },
    {
      operationType: "AccessingData",
      operationName: "missing_some",
      examples: [
        {
          formula: { missing_some: [1, ["a", "b", "c"]] },
          data: { a: "apple" },
          output: [],
          info: "Takes a minimum number of data keys that are required, and an array of keys to search for (same format as var or missing). Returns an empty array if the minimum is met, or an array of the missing keys otherwise.",
          description: "Check for a minimum of 1 key from a, b, or c.",
        },
        {
          formula: { missing_some: [2, ["a", "b", "c"]] },
          data: { a: "apple" },
          output: ["b", "c"],
          info: "Takes an array of data keys to search for (same format as var). Returns an array of any keys that are missing from the data object, or an empty array.",
          description: "Check for a minimum of 2 keys from a, b, or c.",
        },
        {
          formula: {
              if: [
                {
                  merge: [
                    { missing: ["first_name", "last_name"] },
                    { missing_some: [1, ["cell_phone", "home_phone"]] },
                  ],
                },
                "We require first name, last name, and one phone number.",
                "OK to proceed",
              ],
            },
          data: { first_name: "Bruce", last_name: "Wayne" },
          output: "We require first name, last name, and one phone number.",
          info: "This is useful if you’re using missing to track required fields, but occasionally need to require N of M fields.",
          description:
            "Check for required fields first_name, last_name, and at least one phone number.",
        },
      ],
    },
    {
      operationType: "Logic and Boolean Operations",
      operationName: "if",
      examples: [
        {
          formula: {
            if: [true, "yes", "no"],
          },
          data: null,
          output: "yes",
          info: "The if statement typically takes 3 arguments: a condition (if), what to do if it’s true (then), and what to do if it’s false (else).",
          description:
            "If the condition is true, output 'yes', else output 'no'.",
        },
        {
          formula: {
            if: [false, "yes", "no"],
          },
          data: null,
          output: "no",
          info: "The if statement typically takes 3 arguments: a condition (if), what to do if it’s true (then), and what to do if it’s false (else).",
          description:
            "If the condition is false, output 'no', else output 'yes'.",
        },
        {
          formula: {
            if: [
              {
                "<": [
                  {
                    var: "temp",
                  },
                  0,
                ],
              },
              "freezing",
              {
                "<": [
                  {
                    var: "temp",
                  },
                  100,
                ],
              },
              "liquid",
              "gas",
            ],
          },
          data: {
            temp: 55,
          },
          output: "liquid",
          info: "The if statement typically takes 3 arguments: a condition (if), what to do if it’s true (then), and what to do if it’s false (else).",
          description:
            "Output 'freezing' if temp is below 0, 'liquid' if below 100, else 'gas'.",
        },
      ],
    },
    {
      operationType: "Logic and Boolean Operations",
      operationName: "==",
      examples: [
        {
          formula: {
            "==": [1, 1],
          },
          data: null,
          output: true,
          info: "Tests equality, with type coercion.",
          description: "Check if 1 is equal to 1.",
        },
        {
          formula: {
            "==": [1, "1"],
          },
          data: null,
          output: true,
          info: "Tests equality, with type coercion.",
          description: "Check if 1 is equal to '1'.",
        },
        {
          formula: {
            "==": [0, false],
          },
          data: null,
          output: true,
          info: "Tests equality, with type coercion.",
          description: "Check if 0 is equal to false.",
        },
      ],
    },
    {
      operationType: "Logic and Boolean Operations",
      operationName: "===",
      examples: [
        {
          formula: {
            "===": [1, 1],
          },
          data: null,
          output: true,
          info: "Tests strict equality.",
          description: "Check if 1 is strictly equal to 1.",
        },
        {
          formula: {
            "===": [1, "1"],
          },
          data: null,
          output: false,
          info: "Tests strict equality.",
          description: "Check if 1 is strictly equal to '1'.",
        },
      ],
    },
    {
      operationType: "Logic and Boolean Operations",
      operationName: "!=",
      examples: [
        {
          formula: {
            "!=": [1, 2],
          },
          data: null,
          output: true,
          info: "Tests not-equal, with type coercion.",
          description: "Check if 1 is not equal to 2.",
        },
        {
          formula: {
            "!=": [1, "1"],
          },
          data: null,
          output: false,
          info: "Tests not-equal, with type coercion.",
          description: "Check if 1 is not equal to '1'.",
        },
      ],
    },
    {
      operationType: "Logic and Boolean Operations",
      operationName: "!==",
      examples: [
        {
          formula: {
            "!==": [1, 2],
          },
          data: null,
          output: true,
          info: "Tests strict not-equal.",
          description: "Check if 1 is strictly not equal to 2.",
        },
        {
          formula: {
            "!==": [1, "1"],
          },
          data: null,
          output: true,
          info: "Tests strict not-equal.",
          description: "Check if 1 is strictly not equal to '1'.",
        },
      ],
    },
    {
      operationType: "Logic and Boolean Operations",
      operationName: "!",
      examples: [
        {
          formula: {
            "!": [true],
          },
          data: null,
          output: false,
          info: "Logical negation (“not”). Takes just one argument.",
          description: "Negate the truth value of true.",
        },
        {
          formula: {
            "!": true,
          },
          data: null,
          output: false,
          info: "Logical negation (“not”). Takes just one argument.",
          description: "Negate the truth value of true.",
        },
      ],
    },
    {
      operationType: "Logic and Boolean Operations",
      operationName: "!!",
      examples: [
        {
          formula: {
            "!!": [[]],
          },
          data: null,
          output: false,
          info: "Double negation, or “cast to a boolean.” Takes a single argument.",
          description: "Convert an empty array to boolean.",
        },
        {
          formula: {
            "!!": ["0"],
          },
          data: null,
          output: true,
          info: "Double negation, or “cast to a boolean.” Takes a single argument.",
          description: "Convert '0' to boolean.",
        },
      ],
    },
    {
      operationType: "Logic and Boolean Operations",
      operationName: "or",
      examples: [
        {
          formula: {
            or: [true, false],
          },
          data: null,
          output: true,
          info: "or can be used for simple boolean tests, with 1 or more arguments.",
          description: "Check if either true or false.",
        },
        {
          formula: {
            or: [false, "a"],
          },
          data: null,
          output: "a",
          info: "or returns the first truthy argument, or the last argument.",
          description: "Check for the first truthy value or the last value.",
        },
        {
          formula: {
            or: [false, 0, "a"],
          },
          data: null,
          output: "a",
          info: "or returns the first truthy argument, or the last argument.",
          description: "Check for the first truthy value or the last value.",
        },
      ],
    },
    {
      operationType: "Logic and Boolean Operations",
      operationName: "and",
      examples: [
        {
          formula: {
            and: [true, true],
          },
          data: null,
          output: true,
          info: "and can be used for simple boolean tests, with 1 or more arguments.",
          description: "Check if both true.",
        },
        {
          formula: {
            and: [true, false],
          },
          data: null,
          output: false,
          info: "and returns the first falsy argument, or the last argument.",
          description: "Check if one or both are false.",
        },
        {
          formula: {
            and: [true, "a", 3],
          },
          data: null,
          output: 3,
          info: "and returns the first falsy argument, or the last argument.",
          description: "Check if one or both are false.",
        },
      ],
    },
    {
      operationType: "Numeric Operations",
      operationName: ">",
      examples: [
        {
          formula: {
            ">": [2, 1],
          },
          data: null,
          output: true,
          info: "Greater than.",
          description: "Check if 2 is greater than 1.",
        },
      ],
    },
    {
      operationType: "Numeric Operations",
      operationName: ">=",
      examples: [
        {
          formula: {
            ">=": [1, 1],
          },
          data: null,
          output: true,
          info: "Greater than or equal to.",
          description: "Check if 1 is greater than or equal to 1.",
        },
      ],
    },
    {
      operationType: "Numeric Operations",
      operationName: "<",
      examples: [
        {
          formula: {
            "<": [1, 2],
          },
          data: null,
          output: true,
          info: "Less than.",
          description: "Check if 1 is less than 2.",
        },
      ],
    },
    {
      operationType: "Numeric Operations",
      operationName: "<=",
      examples: [
        {
          formula: {
            "<=": [1, 1],
          },
          data: null,
          output: true,
          info: "Less than or equal to.",
          description: "Check if 1 is less than or equal to 1.",
        },
      ],
    },
    {
      operationType: "Numeric Operations",
      operationName: "Between",
      examples: [
        {
          formula: {
            "<": [1, 2, 3],
          },
          data: null,
          output: true,
          info: "You can use a special case of < and <= to test that one value is between two others. Between exclusive.",
          description: "Check if 1 is between 2 and 3 (exclusive).",
        },
        {
          formula: {
            "<": [1, 1, 3],
          },
          data: null,
          output: false,
          info: "You can use a special case of < and <= to test that one value is between two others. Between exclusive.",
          description: "Check if 1 is between 1 and 3 (exclusive).",
        },
        {
          formula: {
            "<": [1, 4, 3],
          },
          data: null,
          output: false,
          info: "You can use a special case of < and <= to test that one value is between two others. Between exclusive.",
          description: "Check if 1 is between 4 and 3 (exclusive).",
        },
        {
          formula: {
            "<=": [1, 2, 3],
          },
          data: null,
          output: true,
          info: "You can use a special case of < and <= to test that one value is between two others. Between inclusive.",
          description: "Check if 1 is between 2 and 3 (inclusive).",
        },
        {
          formula: {
            "<=": [1, 1, 3],
          },
          data: null,
          output: true,
          info: "You can use a special case of < and <= to test that one value is between two others. Between inclusive.",
          description: "Check if 1 is between 1 and 3 (inclusive).",
        },
        {
          formula: {
            "<=": [1, 4, 3],
          },
          data: null,
          output: false,
          info: "You can use a special case of < and <= to test that one value is between two others. Between inclusive.",
          description: "Check if 1 is between 4 and 3 (inclusive).",
        },
      ],
    },
    {
      operationType: "Numeric Operations",
      operationName: "max",
      examples: [
        {
          formula: {
            max: [1, 2, 3],
          },
          data: null,
          output: 3,
          info: "Return the maximum from a list of values.",
          description: "Find the maximum from 1, 2, and 3.",
        },
      ],
    },
    {
      operationType: "Numeric Operations",
      operationName: "min",
      examples: [
        {
          formula: {
            min: [1, 2, 3],
          },
          data: null,
          output: 1,
          info: "Return the minimum from a list of values.",
          description: "Find the minimum from 1, 2, and 3.",
        },
      ],
    },
    {
      operationType: "Arithmetic Operations",
      operationName: "+",
      examples: [
        {
          formula: {
            "+": [4, 2],
          },
          data: null,
          output: 6,
          info: "Addition.",
          description: "Add 4 and 2.",
        },
      ],
    },
    {
      operationType: "Arithmetic Operations",
      operationName: "-",
      examples: [
        {
          formula: {
            "-": [4, 2],
          },
          data: null,
          output: 2,
          info: "Subtraction.",
          description: "Subtract 2 from 4.",
        },
      ],
    },
    {
      operationType: "Arithmetic Operations",
      operationName: "*",
      examples: [
        {
          formula: {
            "*": [4, 2],
          },
          data: null,
          output: 8,
          info: "Multiplication.",
          description: "Multiply 4 and 2.",
        },
      ],
    },
    {
      operationType: "Arithmetic Operations",
      operationName: "/",
      examples: [
        {
          formula: {
            "/": [4, 2],
          },
          data: null,
          output: 2,
          info: "Division.",
          description: "Divide 4 by 2.",
        },
      ],
    },
    {
      operationType: "Arithmetic Operations",
      operationName: "%",
      examples: [
        {
          formula: {
            "%": [5, 2],
          },
          data: null,
          output: 1,
          info: "Modulo (remainder of division).",
          description: "Find the remainder when 5 is divided by 2.",
        },
      ],
    },
    {
      operationType: "String Operations",
      operationName: "concat",
      examples: [
        {
          formula: {
            concat: ["foo", "bar"],
          },
          data: null,
          output: "foobar",
          info: "Concatenates two strings.",
          description: "Concatenate 'foo' and 'bar'.",
        },
      ],
    },
    {
      operationType: "String Operations",
      operationName: "substring",
      examples: [
        {
          formula: {
            substring: ["foobar", 0, 3],
          },
          data: null,
          output: "foo",
          info: "Returns a portion of a string.",
          description:
            "Get the substring of 'foobar' starting from index 0 with a length of 3.",
        },
      ],
    },
    {
      operationType: "Array Operations",
      operationName: "map",
      examples: [
        {
          formula: {
            map: [
              {
                var: "integers",
              },
              {
                "*": [
                  {
                    var: "",
                  },
                  2,
                ],
              },
            ],
          },
          data: {
            integers: [1, 2, 3, 4, 5],
          },
          output: [2, 4, 6, 8, 10],
          info: "You can use map to perform an action on every member of an array.",
          description: "Double each number in the 'integers' array.",
        },
      ],
    },
    {
      operationType: "Array Operations",
      operationName: "filter",
      examples: [
        {
          formula: {
            filter: [
              {
                var: "integers",
              },
              {
                "%": [
                  {
                    var: "",
                  },
                  2,
                ],
              },
            ],
          },
          data: {
            integers: [1, 2, 3, 4, 5],
          },
          output: [1, 3, 5],
          info: "You can use filter to keep only elements of the array that pass a test.",
          description: "Filter out even numbers from the 'integers' array.",
        },
      ],
    },
    {
      operationType: "Array Operations",
      operationName: "reduce",
      examples: [
        {
          formula: {
            reduce: [
              {
                var: "integers",
              },
              {
                "+": [
                  {
                    var: "current",
                  },
                  {
                    var: "accumulator",
                  },
                ],
              },
              0,
            ],
          },
          data: {
            integers: [1, 2, 3, 4, 5],
          },
          output: 15,
          info: "You can use reduce to combine all the elements in an array into a single value.",
          description: "Sum all the numbers in the 'integers' array.",
        },
      ],
    },
    {
      operationType: "Array Operations",
      operationName: "all",
      examples: [
        {
          formula: {
            all: [
              [1, 2, 3],
              {
                ">": [
                  {
                    var: "",
                  },
                  0,
                ],
              },
            ],
          },
          data: null,
          output: true,
          info: "This operation takes an array, and performs a test on each member of that array.",
          description: "Check if all numbers in the array are greater than 0.",
        },
      ],
    },
    {
      operationType: "Array Operations",
      operationName: "some",
      examples: [
        {
          formula: {
            some: [
              [-1, 0, 1],
              {
                ">": [
                  {
                    var: "",
                  },
                  0,
                ],
              },
            ],
          },
          data: null,
          output: true,
          info: "This operation takes an array, and performs a test on each member of that array.",
          description: "Check if some numbers in the array are greater than 0.",
        },
      ],
    },
    {
      operationType: "Array Operations",
      operationName: "none",
      examples: [
        {
          formula: {
            none: [
              [-3, -2, -1],
              {
                ">": [
                  {
                    var: "",
                  },
                  0,
                ],
              },
            ],
          },
          data: null,
          output: true,
          info: "This operation takes an array, and performs a test on each member of that array.",
          description:
            "Check if none of the numbers in the array are greater than 0.",
        },
      ],
    },
    {
      operationType: "Array Operations",
      operationName: "merge",
      examples: [
        {
          formula: {
            merge: [
              [1, 2],
              [3, 4],
            ],
          },
          data: null,
          output: [1, 2, 3, 4],
          info: "Takes one or more arrays, and merges them into one array.",
          description: "Merge two arrays into one.",
        },
      ],
    },
    {
      operationType: "Array Operations",
      operationName: "in",
      examples: [
        {
          formula: {
            in: ["Ringo", ["John", "Paul", "George", "Ringo"]],
          },
          data: null,
          output: true,
          info: "If the second argument is an array, tests that the first argument is a member of the array.",
          description: "Check if 'Ringo' is in the list of names.",
        },
      ],
    },
    {
      operationType: "String Operations",
      operationName: "in",
      examples: [
        {
          formula: {
            in: ["Spring", "Springfield"],
          },
          data: null,
          output: true,
          info: "If the second argument is a string, tests that the first argument is a substring.",
          description: "Check if 'Spring' is a substring of 'Springfield'.",
        },
      ],
    },
    {
      operationType: "String Operations",
      operationName: "cat",
      examples: [
        {
          formula: {
            cat: ["I love", " pie"],
          },
          data: null,
          output: "I love pie",
          info: "Concatenate all the supplied arguments.",
          description: "Concatenate 'I love' with 'pie'.",
        },
        {
          formula: {
            cat: [
              "I love ",
              {
                var: "filling",
              },
              " pie",
            ],
          },
          data: {
            filling: "apple",
            temp: 110,
          },
          output: "I love apple pie",
          info: "Concatenate with data object properties.",
          description:
            "Concatenate 'I love', the 'filling' variable, and ' pie'.",
        },
      ],
    },
    {
      operationType: "String Operations",
      operationName: "substr",
      examples: [
        {
          formula: {
            substr: ["jsonlogic", 4],
          },
          data: null,
          output: "logic",
          info: "Get a portion of a string.",
          description: "Get the substring of 'jsonlogic' starting from index 4.",
        },
        {
          formula: {
            substr: ["jsonlogic", -5],
          },
          data: null,
          output: "logic",
          info: "Get a portion from the end of a string.",
          description:
            "Get the substring of 'jsonlogic' starting from the 5th character from the end.",
        },
        {
          formula: {
            substr: ["jsonlogic", 1, 3],
          },
          data: null,
          output: "son",
          info: "Specify a positive length.",
          description:
            "Get the substring of 'jsonlogic' starting from index 1 with a length of 3.",
        },
        {
          formula: {
            substr: ["jsonlogic", 4, -2],
          },
          data: null,
          output: "log",
          info: "Specify a negative length.",
          description:
            "Get the substring of 'jsonlogic' starting from index 4 with a length of 2 characters from the end.",
        },
      ],
    },
    {
      operationType: "Miscellaneous",
      operationName: "log",
      examples: [
        {
          formula: {
            log: "apple",
          },
          data: null,
          output: "apple",
          info: "Logs the first value to console, then passes it through unmodified.",
          description: "Log the value 'apple' to console.",
        },
      ],
    },
  ];
  