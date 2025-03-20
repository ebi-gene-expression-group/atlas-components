#Organ anatomograms general rules
##Size 
The canvas size should be within `width=210mm` and `height=297mm` as the other svg's size and the viewBox size must match width and height.
For example:
```
width="95.575813"
height="151.60188"
viewBox="0 0 95.575813 151.60188"
```


##Structure
There should be just two main layers: `Outline` and `LAYER_EFO`.

`Outline` contains paths forming the complete overall outline (i.e. the black outline, empty) and needs to be placed at the layer `LAYER_EFO` which contains all the svg path and objects.

##Transition elements

The box shape used as a link to other, level down, images top, above the other shapes and layers, i.e. above `LAYER_EFO`.

`LAYER_EFO` which contains all the other paths/’filler’ grey shapes apart from the Outline. Different tissue/structure shapes in this layer should not be grouped together and should be at the same level inside the `LAYER_EFO` layer (not nested). However, paths belonging to the same region/cell type shape need to be grouped together and the whole group should be labelled with a single ontology ID (i.e. each tissue path/shape should have a tissue ID as its property at the level of the `<g>` group component.)

##Object IDs and labels 

Every tissue group should have a title attribute with the tissue name. `Outline` layer should **NOT** have a title attribute.




##Style and Transparency
Different rules apply to `Outline` and `LAYER_EFO`

- `Outline`: The shape in the `Outline` layer should not be transparent for implementation and should have solid black colour
- `LAYER_EFO`: The shapes in `LAYER_EFO` should be assigned solid grey colour codes, which, however, are supplied separately in a list/table (Shades table, see point 6 for details). For implementation, the shapes in the svg need to have no style at all (and be set at total opacity), applied at the level of the whole group, not individual paths within each group.

To achieve that in Inkscape:

Select the ontology ID labelled object > in the `Fill` and `Stroke/Fill` pane select the ‘x’ (no paint) option
Any paths or groups of paths inside the ontology ID labelled object need to have the ‘?’ setting in Fill and Stroke/Fill > select all the member objects within the ID object and select the ‘?’ option in the Fill and Stroke/Fill  pane
in the whole organ stack should be just another group within `LAYER_EFO` to be active to click. The ‘ID’ for the link should be in the format `link_tissueName` (all lower case). The box shapes need to be placed uppermost within LAYER_EFO (above all region/cell shapes). Wrapper layer should have ? as Fill property and the path itself should have X as Fill property. Note that this is the reverse of the regular region/cell shapes

##Colour 
Define specific colour (shade of grey) for individual region/cell type shapes within `LAYER_EFO` - especially needed for 
shapes that overlap, 
shapes that are closely adjacent and would create an impression of continuous structure if coloured in the same shade,
shapes for biologically and annotation-wise distinct entities that morphologically look the same (e.g. distinct cell types in pancreatic islet)
The colour codes for these defined shapes are to be supplied to the developer in a table with shape IDs and corresponding colour codes (‘Shades table’, stored in this folder)

##Overlapping structures
- Subclass: Shapes that are a subset of a larger (parent) shape but do not cover/overlap with it completely > smaller shapes placed above the bigger parent shape and the fact that this is a subclass type of overlap is communicated to the developer via annotation in an additional column in the Shades Table

**Developer’s note: in main path, add attribute overlap: subclass_ID**

- Alternative: Shapes that are a subset of a larger (parent) shape but cover it completely > smaller shapes placed below the bigger parent shape and the fact that this is an Alternative type of overlap is communicated to the developer via annotation in an additional column in the Shades Table

**Developer’s note: the order and the opacity matter here**
```
<g
     transform="matrix(1.0351975,0,0,1.001904,-11.152314,-0.21822709)"
     style="opacity:0.68999999;fill:none;fill-opacity:1"
     id="UBERON_0002170">
<desc id="desc916">upper lobe of right lung</desc>
<title id="title914">upper lobe of right lung</title>
<path
       style="fill-opacity:1"
       id="path68"
       d="m 184.4,164.8 c -16.3,..."
       class="st0"
       inkscape:connector-curvature="0" />
</g>

<g
 transform="translate(-8.1,0.7)"
 style="opacity:0.68999999;fill:none;fill-opacity:1"
 id="UBERON_0002174">
<desc id="desc912">middle lobe of right lung</desc>
<title id="title910">middle lobe of right lung</title>
<path
 style="fill-opacity:1"
 id="path71"
 d="m 22.7,390.7 c -7.9,28 ..."
 inkscape:connector-curvature="0" />
</g>

<g
 transform="matrix(1.0351975,0,0,1.001904,-11.152314,-0.21822709)"
 style="opacity:0.68999999;fill:none;fill-opacity:1"
 id="test">
<desc id="desc916">upper middle lobe of right lung</desc>
<title id="title914">upper middle lobe of right lung</title>
<path style="fill-opacity:0.5"
          id="path60"
  d="m 184.4,164.8 c -...”
</g>
```


Ideally, within each tissue group, there should be pure path or paths (not subgroups, otherwise the group selection/detection will be confused), unless grouping is genuinely needed/useful


