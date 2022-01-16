from flask import Flask
import requests
from flask_sqlalchemy import SQLAlchemy
from flask import request
from flask import jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:hasaan@localhost/Products'
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.debug=True
db=SQLAlchemy(app)

class products(db.Model):
    __tablename__='products_list'
    productID = db.Column(db.Integer(),primary_key=True,nullable=False)
    title = db.Column(db.String(),nullable=False)
    thumbnail = db.Column(db.String(),nullable=False)
    price = db.Column(db.Integer(),nullable=False)
    currency = db.Column(db.String(),nullable=False)
    
    def __init__(self,productID,title,thumbnail,price,currency):
        self.productID=productID
        self.price=price
        self.title=title
        self.currency=currency
        self.thumbnail=thumbnail
    
class productInsights(db.Model):
    __tablename__ = 'product_insights'
    insightID = db.Column(db.Integer(),primary_key=True)
    productRefID = db.Column(db.Integer(),db.ForeignKey('products_list.productID'))
    rating = db.Column(db.Float())
    review = db.Column(db.String())
    
    def __init__(self,productRefID,rating,review,insightID):
        self.insightID=insightID
        self.productRefID=productRefID
        self.rating=rating
        self.review=review
        

        


db.create_all()
url = "https://fakestoreapi.com/products"

   

response = requests.request("GET", url)
print(response.json())
print(str(response.json()[0]['id']) + response.json()[0]["title"])
items = response.json()
getproduct=products.query.all()


for objects in range(len( items)):
    print(items[objects])
    newPrimaryKey= len(getproduct)+objects
    IndProduct =products(productID = newPrimaryKey,title=items[objects]['title'],thumbnail=items[objects]['image'],price=items[objects]['price'],currency='$')
    db.session.add(IndProduct)
    db.session.commit()
   


     
@app.route('/review',methods=['POST'])
@cross_origin()
def AddReview():
    review =request.get_json()
    getproduct=productInsights.query.all()
    print(len(getproduct)+1)
    indprimary=len(getproduct)+1
  
    
    IndInsight = productInsights(insightID=indprimary,rating=review['rating'],review=review['review'],productRefID=review['productRefID'])
    db.session.add(IndInsight)
    db.session.commit()
    print(review)
    return review


@app.route("/getProducts",methods=['get'])
@cross_origin()
def SendProductsToFromtend():
    completeDetails=db.session.query(products).all()
    arrayofproducts=[]
    arrayOfReviews =[]
    arrayofreviewsforspecific=[]
    avarageRating =0
    numberofoccurance=0
    print(completeDetails)
    for productss in completeDetails:
        currentproduct={"title":productss.title,
                        "productID" :productss.productID,
                        "thumbnail" :productss.thumbnail,
                        "price" :productss.price,
                        "currency":productss.currency,
                      
                        }
        # print(currentproduct)
        arrayofproducts.append(currentproduct)
    reviews=db.session.query(productInsights).all()
    # print(reviews)
    for gotreviews in reviews:
       currentreview={
            "insightID":  gotreviews.insightID,
            "productRefID":  gotreviews.productRefID,
            "rating" : gotreviews.rating,
            "review" : gotreviews.review
       }
       arrayOfReviews.append(currentreview)
    # print(arrayOfReviews)
    for merging in range (0,len(arrayofproducts)):
       
        for mergereview in range(0,len(arrayOfReviews)):
            if arrayofproducts[merging]["productID"]==arrayOfReviews[mergereview]['productRefID']:
                arrayofreviewsforspecific.append(arrayOfReviews[mergereview]['review'])
                avarageRating=avarageRating + arrayOfReviews[mergereview]['rating']
                numberofoccurance=numberofoccurance+1
                arrayofproducts[merging]['review']=arrayofreviewsforspecific
                # print(arrayofreviewsforspecific[mergereview])
        if numberofoccurance>0:
            arrayofproducts[merging]['rating']=avarageRating/numberofoccurance
        else:    
            arrayofproducts[merging]['rating']=5 
            arrayofproducts[merging]["review"]=[]   
        avarageRating=0
        numberofoccurance=0
        arrayofreviewsforspecific=[]       
    # print(arrayofproducts)
    return jsonify( arrayofproducts)

if __name__ == "__main__":
   app.run(port=2000,debug=True,)