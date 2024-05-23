INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n', 'Admin')

DELETE FROM public.account
WHERE account_firstname = 'Tony'

UPDATE 
	inventory	
SET
	inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior') 
WHERE inv_make = 'GM' and inv_model = 'Hummer'


SELECT inv_model, inv_make, classification_name
FROM inventory
INNER JOIN classification
ON classification_name = 'Sport'

UPDATE 
	inventory
SET
	inv_image = REPLACE(inv_image, 'images/', 'images/vehichles/'), inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehichles/')

