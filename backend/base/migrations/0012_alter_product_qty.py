# Generated by Django 3.2 on 2021-07-05 04:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0011_product_qty'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='qty',
            field=models.IntegerField(blank=True, default=10, null=True),
        ),
    ]
