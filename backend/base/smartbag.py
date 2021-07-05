from datetime import datetime
from .models import *
from .serializers import *

import numpy as np
import pandas as pd

import os

path = 'files'

def func(user):

    # print(user.id)

    csv_name = user.first_name 

    orders = Order.objects.filter(user=user)

    serializer = OrderSerializer(orders, many=True)
    orders_data = serializer.data

    products = [item.name for item in Product.objects.all()]
    ratings = [item.rating for item in Product.objects.all()]
    reviews = [item.numReviews for item in Product.objects.all()]
    prices = [item.price for item in Product.objects.all()]
    countsInStock = [item.countInStock for item in Product.objects.all()]
    purchaseCount = []
    totalQuantity = []
    daysSincePurchase = []

    quantityCount = {}
    orderCount = {}
    dayCount = {}
    
    for orders in orders_data:
        for items in orders["orderItems"]:
            product = Product.objects.get(_id=items["product"])
            for key, value in orderCount.items():
                if key == product.name:
                    orderCount[key] = value + 1
                    quantityCount[key] = value + items["quantity"]
                    delta = datetime.strptime(str(datetime.now())[:10], "%Y-%m-%d") - datetime.strptime(orders['paidAt'][:10], "%Y-%m-%d")
                    print(datetime.now(), orders["paidAt"], delta)
                    dayCount[key] = delta.days
                    break
            else:
                orderCount[product.name] = 1
                quantityCount[product.name] = items["quantity"]
                dayCount[product.name] = 0
        

    for product in products:
        for key, value in orderCount.items():
            if key == product:
                purchaseCount.append(value)
                break
        else:
            purchaseCount.append(0)

    for product in products:
        for key, value in quantityCount.items():
            if key == product:
                totalQuantity.append(value)
                break
        else:
            totalQuantity.append(0)

    for product in products:
        for key, value in dayCount.items():
            if key == product:
                daysSincePurchase.append(value)
                break
        else:
            daysSincePurchase.append(0)

    data = {
        "Products": products,
        "Reviews": reviews,
        "Ratings": ratings,
        "Price": prices,
        "CountsInStock": countsInStock,
        "Quantity": totalQuantity,
        "DaysSincePurchase": daysSincePurchase,
        "PurchaseCount": purchaseCount
    }

    frame = pd.DataFrame(data)    

    # print(frame)

    frame.to_csv(os.path.join(path, f'{csv_name}.csv'))



