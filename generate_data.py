import csv
import random

first_names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Neha", "Ramesh", "Sunita", "Raj", "Pooja", "Arun", "Kavita", "Suresh", "Gita", "Tariq", "Fatima"]
last_names = ["Patel", "Singh", "Kumar", "Sharma", "Verma", "Gupta", "Desai", "Reddy", "Yadav", "Mishra", "Das", "Khan", "Chaudhary", "Iyer"]
departments = ["IT Centre", "HR", "Accounts", "Shop Floor", "Engineering", "Logistics", "Administration", "Quality Control", "Electrical", "Mechanical"]

print("Generating 5,000 employee records...")

with open('bulk_blw_data.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    # Write the exact headers the backend expects
    writer.writerow(["Name", "Department", "DOB"])
    
    # 1. Rig the first 3 rows with today's date (March 17) for the Marquee test
    writer.writerow(["Amaan Ansari", "IT Centre", "2002-03-17"])
    writer.writerow(["Amir Suhail", "Engineering", "1999-03-17"])
    writer.writerow(["Emilia Clarke", "UI-UX Design", "1986-03-17"])
    
    # 2. Generate 4,997 random employees
    for _ in range(4997):
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        dept = random.choice(departments)
        
        # Random DOB between 1965 and 2002
        year = random.randint(1965, 2002)
        month = random.randint(1, 12)
        day = random.randint(1, 28) # Kept at 28 to avoid February leap year math
        
        # Format as YYYY-MM-DD
        dob = f"{year}-{month:02d}-{day:02d}"
        
        writer.writerow([name, dept, dob])

print("✅ Success! 'bulk_blw_data.csv' has been created.")