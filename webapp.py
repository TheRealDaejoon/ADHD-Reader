from flask import Flask, request, render_template_string

app = Flask(__name__)

# Algorithm for making letters bold
def make_first_third_bold(text):
    words = text.split()
    result = ""
    for word in words:
        length = len(word)
        if length >= 9:
            bold_length = length // 3
        elif length > 5 and length < 9:
            bold_length = 3 
        elif length > 3 and length < 6:
            bold_length = 2  
        else:
            bold_length = 1  # Make the first letter bold for words with 3 or fewer letters
        formatted_word = "<b>" + word[:bold_length] + "</b>" + word[bold_length:]
        result += formatted_word + " "
    return result.strip()

# Adding result to webpage with formatting for before and after.
@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        input_string = request.form['input_string']
        output_string = make_first_third_bold(input_string)
        return render_template_string('''
            <!doctype html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <style>
                    body {
                        font-family: 'Open Dyslexic', Arial, sans-serif;
                        line-height: 2;
                        margin: 25px;
                    }
                    form {
                        margin-bottom: 20px;
                    }
                    textarea {
                        width: 100%;
                        height: 150px;
                        padding: 10px;
                        margin: 10px 0;
                        box-sizing: border-box;
                        font-size: 16px;
                    }
                    input[type="submit"] {
                        padding: 10px 20px;
                        font-size: 16px;
                        background-color: #007BFF;
                        color: white;
                        border: none;
                        cursor: pointer;
                    }
                    input[type="submit"]:hover {
                        background-color: #0056b3;
                    }
                    .output {
                        white-space: pre-wrap;
                    }
                </style>
            </head>
            <body>
                <form method="post">
                    <label for="input_string">Input String:</label>
                    <textarea id="input_string" name="input_string">{{ input_string }}</textarea>
                    <input type="submit" value="Transform">
                </form>
                <div class="output">
                    <p>Output String:</p>
                    <p>{{ output_string|safe }}</p>
                </div>
            </body>
            </html>
        ''', input_string=input_string, output_string=output_string)
    return render_template_string('''
        <!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <style>
                body {
                    font-family: 'Open Dyslexic', Arial, sans-serif;
                    line-height: 2;
                    margin: 25px;
                }
                form {
                    margin-bottom: 20px;
                }
                textarea {
                    width: 100%;
                    height: 150px;
                    padding: 10px;
                    margin: 10px 0;
                    box-sizing: border-box;
                    font-size: 16px;
                }
                input[type="submit"] {
                    padding: 10px 20px;
                    font-size: 16px;
                    background-color: #007BFF;
                    color: white;
                    border: none;
                    cursor: pointer;
                }
                input[type="submit"]:hover {
                    background-color: #0056b3;
                }
                .output {
                    white-space: pre-wrap;
                }
            </style>
        </head>
        <body>
            <form method="post">
                <label for="input_string">Input String:</label>
                <textarea id="input_string" name="input_string"></textarea>
                <input type="submit" value="Transform">
            </form>
        </body>
        </html>
    ''')

# Webpage 'test'
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
