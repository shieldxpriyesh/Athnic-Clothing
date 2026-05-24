from django.db import models
from django.contrib.auth.models import User


class ShippingAddress(models.Model):
    INDIAN_STATES = [
        ('AN', 'Andaman and Nicobar Islands'), ('AP', 'Andhra Pradesh'),
        ('AR', 'Arunachal Pradesh'), ('AS', 'Assam'), ('BR', 'Bihar'),
        ('CH', 'Chandigarh'), ('CT', 'Chhattisgarh'),
        ('DN', 'Dadra and Nagar Haveli'), ('DD', 'Daman and Diu'),
        ('DL', 'Delhi'), ('GA', 'Goa'), ('GJ', 'Gujarat'),
        ('HR', 'Haryana'), ('HP', 'Himachal Pradesh'),
        ('JK', 'Jammu and Kashmir'), ('JH', 'Jharkhand'),
        ('KA', 'Karnataka'), ('KL', 'Kerala'), ('LA', 'Ladakh'),
        ('MP', 'Madhya Pradesh'), ('MH', 'Maharashtra'), ('MN', 'Manipur'),
        ('ML', 'Meghalaya'), ('MZ', 'Mizoram'), ('NL', 'Nagaland'),
        ('OR', 'Odisha'), ('PB', 'Punjab'), ('PY', 'Puducherry'),
        ('RJ', 'Rajasthan'), ('SK', 'Sikkim'), ('TN', 'Tamil Nadu'),
        ('TG', 'Telangana'), ('TR', 'Tripura'), ('UP', 'Uttar Pradesh'),
        ('UK', 'Uttarakhand'), ('WB', 'West Bengal'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='shipping_addresses'
    )
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    line1 = models.CharField('Address Line 1', max_length=255)
    line2 = models.CharField('Address Line 2', max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=5, choices=INDIAN_STATES)
    pincode = models.CharField(max_length=6)
    is_default = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = 'Shipping Addresses'

    def save(self, *args, **kwargs):
        # Ensure only one default address per user
        if self.is_default:
            ShippingAddress.objects.filter(
                user=self.user, is_default=True
            ).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.city}, {self.state} ({self.pincode})"
