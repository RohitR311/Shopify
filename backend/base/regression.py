from .models import *
from .serializers import *

from .smartbag import func

import numpy as np
import pandas as pd

from sklearn.linear_model import LinearRegression

def regression(user):
    func(user)

    resultCount = {}
    index = 0

    csv_name = user.first_name 

    dataset = pd.read_csv(f'files/{csv_name}.csv', index_col=0)

    X = dataset.iloc[:, 1:-2].values
    y = dataset.iloc[:, -1].values

    regressor = LinearRegression()
    regressor.fit(X, y)

    y_pred = regressor.predict(X)
    y_pred = np.around(y_pred,2)

    products = [item.name for item in Product.objects.all()]

    for product in products:
        if product not in resultCount:
            resultCount[product] = y_pred[index]
            index += 1
        else:
            resultCount[product].append(y_pred[index])
            index += 1

    sort_resultCount = sorted(resultCount.items(), key=lambda x: x[1], reverse=True)

    return sort_resultCount