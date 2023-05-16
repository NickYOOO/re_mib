from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://sparta:test@cluster0.g7hmo1x.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/reviews", methods=["POST"])
def reviews_post():
    name_receive = request.form['name_give']
    star_receive = request.form['star_give']
    comment_receive = request.form['comment_give']
    img_receive = request.form['img_give']
    pw_receive = request.form['pw_give']

    doc = {
        'name' : name_receive,
        'star' : star_receive,
        'comment' : comment_receive,
        'img' : img_receive,
        'pw' : pw_receive
    }

    db.reviews.insert_one(doc)

    return jsonify({'msg':'게시글 작성 완료!'})

@app.route("/reviews/update", methods=["POST"])
def modify_reviews():
    name_receive = request.form['name_give']
    star_receive = request.form['star_give']
    comment_receive = request.form['comment_give']
    img_receive = request.form['img_give']
    pw_receive = request.form['pw_give']
    id_receive = request.form['_id_give']
    
    doc = {
        'name' : name_receive,
        'star' : star_receive,
        'comment' : comment_receive,
        'img' : img_receive,
        'pw' : pw_receive
    }
    print("가나다", id_receive, doc)

    db.reviews.update_one({"_id": ObjectId(id_receive)}, {"$set" : doc})

    return jsonify({'msg':'게시글 수정 완료!'})

from bson.objectid import ObjectId

@app.route("/reviews", methods=["GET"])
def reviews_get():
    all_reviews = list(db.reviews.find({}))
    
    result = []
    for review in all_reviews:
        review['_id'] = str(ObjectId(review['_id'])) # convert the ObjectId to a string
        # print(review)
        result.append(review)

    return jsonify({'result': result})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)