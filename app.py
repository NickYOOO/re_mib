from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
import certifi

ca = certifi.where()

client = MongoClient('mongodb+srv://sparta:test@cluster0.isqkcv6.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)
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

@app.route("/reviews", methods=["GET"])
def reviews_get():
    all_reviews = list(db.reviews.find({},{'_id':False}))

    return jsonify({'result':all_reviews})

@app.route("/reviews/<id>", methods=["DELETE"])
def reviews_delete(id):
    # 데이터베이스에서 해당 ID 값을 가진 리뷰를 삭제합니다.
    db.reviews.delete_one({"_id": ObjectId(id)})
    return jsonify({"msg": "삭제 완료!"})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)