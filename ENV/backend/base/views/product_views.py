from base.regression import regression
from django.shortcuts import render



from geojson import Feature, Point, FeatureCollection


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from base.models import *
from base.serializers import *
from rest_framework import status
from ..smartbag import func

import json

# Get all products
@api_view(["GET"])
def getProducts(request):
    query = request.query_params.get("keyword")
    if query == None:
        query = ""

    products = Product.objects.filter(name__icontains=query).order_by('-createdAt')

    page = request.query_params.get("page")
    paginator = Paginator(products, 6)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)

    serializer = ProductSerializer(products, many=True)
    return Response(
        {"products": serializer.data, "page": page, "pages": paginator.num_pages}
    )


@api_view(["GET"])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=3).order_by("-rating")[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# Get a single product
@api_view(["GET"])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)

    # func(request)
    # reviews = Review.objects.filter(product=product)

    # page = request.query_params.get("reviewspage")
    # paginator = Paginator(reviews, 1)

    # try:
    #     product = paginator.page(page)
    # except PageNotAnInteger:
    #     product = paginator.page(1)
    # except EmptyPage:
    #     product = paginator.page(paginator.num_pages)

    # if page == None:
    #     page = 1

    # page = int(page)

    # reviewserializer = ReviewSerializer(reviews, many=True)

    serializer = ProductSerializer(product, many=False)
    return Response(
        serializer.data,
        #     "reviews": reviewserializer.data,
        #     "page": page,
        #     "pages": paginator.num_pages,
        # }
    )


@api_view(["POST"])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user

    print(user)

    product = Product.objects.create(
        user=user,
        name="Sample Name",
        price=0,
        brand="Sample Brand",
        countInStock=0,
        category="Sample Category",
        description="",
    )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data["name"]
    product.price = data["price"]
    product.brand = data["brand"]
    product.countInStock = data["countInStock"]
    product.category = data["category"]
    product.description = data["description"]

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    productDelete = Product.objects.get(_id=pk)
    productDelete.delete()
    return Response("Product was deleted successfully")


@api_view(["POST"])
@permission_classes([IsAdminUser])
def uploadImage(request):
    data = request.data

    product_id = data["product_id"]
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get("image")
    product.save()
    return Response("Image was uploaded successfully")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # 1 - Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()

    if alreadyExists:
        content = {"detail": "Product already reviewed"}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2 - No Rating or 0
    elif data["rating"] == 0:
        content = {"detail": "Please select a rating"}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 3 - Create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data["rating"],
            comment=data["comment"],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response("Review added successfully")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getGeneratedProducts(request):
    user =  request.user

    result = regression(user)[:5]

    products = [Product.objects.get(name=name[0]) for name in result]
    bagItems = []

    for product in products:
        serializer = BagSerializer(product, many=False)
        bagItems.append(serializer.data)

    # print(regression(user))

    return Response(bagItems)

@api_view(['GET'])
def getMapData(request):
    locations = ShippingAddres.objects.all()
    serializer = LocationSerializer(locations, many=True)
    return Response(serializer.data)