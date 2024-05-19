import { useGetRestaurant } from "@/api/RestaurantApi";
import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { MenuItem as MenuItemType } from "@/types";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const DetailPage = () => {
  const { restaurantId } = useParams();
  const { restaurant, isLoading } = useGetRestaurant(restaurantId);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // [
  //   {
  //     _id: ITEM_1,
  //     name: cheeze Pizza,
  //     price: 10,
  //     quantity: 1,
  //   },
  //   {
  //     _id: ITEM_2,
  //     name: veggie Pizza,
  //     price: 12,
  //     quantity: 1,
  //   },
  // ]

  const addToCart = (menuItem: MenuItemType) => {
    setCartItems((prevCartItems) => {
      // 1. Check if the item is already in the cart
      const existingCartItem = prevCartItems.find(
        (cartItem) => cartItem._id === menuItem._id
      );

      let updatedCartItems;

      // 2. if item is in cart, update the quantity
      if (existingCartItem) {
        updatedCartItems = prevCartItems.map((cartItem) =>
          cartItem._id === menuItem._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCartItems = [
          ...prevCartItems,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ];
      }

      // 3. if item is not in cart, add it as new item to cart container
      return updatedCartItems
    });
  };

  if (isLoading || !restaurant) {
    // return "Loading...";
    return (
      <div className="flex items-center justify-center">
        Loading... <Loader className="animate-spin ml-2" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <AspectRatio ratio={16 / 5}>
        <img
          src={restaurant.imageUrl}
          className="rounded-md object-cover h-full w-full"
        />
      </AspectRatio>
      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-4">
          <RestaurantInfo restaurant={restaurant} />
          <span className="text-2xl font-bold tracking-tight">Menu</span>
          {restaurant.menuItems.map((menuItem) => (
            <MenuItem menuItem={menuItem} addToCart={()=> addToCart(menuItem)} />
          ))}
        </div>

        <div className="">
          <Card>
            <OrderSummary restaurant={restaurant} cartItems={cartItems} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
